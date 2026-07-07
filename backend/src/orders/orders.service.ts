import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      let totalPrice = new Prisma.Decimal(0);
      const itemsData: {
        productId: string;
        quantity: number;
        price: Prisma.Decimal;
      }[] = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produit introuvable (id: ${item.productId})`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuffisant pour "${product.name}" (disponible: ${product.stock}, demandé: ${item.quantity})`,
          );
        }

        // Décrémente le stock immédiatement dans la transaction
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });

        itemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price, // on fige le prix au moment de la commande
        });

        totalPrice = totalPrice.add(product.price.mul(item.quantity));
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: OrderStatus.PENDING,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      return order;
    });
  }

  async findAllForUser(userId: string, query: QueryOrderDto) {
    const { status, page = 1, limit = 20 } = query;

    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status && { status }),
    };

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Pour l'admin — voit toutes les commandes, tous utilisateurs confondus
  async findAllAdmin(query: QueryOrderDto) {
    const { status, page = 1, limit = 20 } = query;

    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
    };

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true } },
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, requestingUser: { userId: string; role: string }) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    // Un client ne peut voir que SES commandes ; un admin voit tout
    if (requestingUser.role !== 'ADMIN' && order.userId !== requestingUser.userId) {
      throw new ForbiddenException('Accès refusé à cette commande');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    // Si on annule une commande, on doit remettre le stock
    if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      await this.restoreStock(id);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    });
  }

  private async restoreStock(orderId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
    });

    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    );
  }

  // Le client peut annuler SA propre commande, seulement si elle est encore PENDING
  async cancelOwnOrder(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('Accès refusé à cette commande');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Seule une commande en attente peut être annulée',
      );
    }

    await this.restoreStock(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }
}