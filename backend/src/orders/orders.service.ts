import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderStatus } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

async create(userId: string, dto: CreateOrderDto) {
  const isCod = dto.paymentMethod === 'COD';

  const order = await this.prisma.$transaction(async (tx) => {
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
        throw new NotFoundException(`Produit introuvable (id: ${item.productId})`);
      }
      if (!product.isActive) {
        throw new BadRequestException(`"${product.name}" n'est plus disponible`);
      }

      if (isCod) {
        const result = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw new BadRequestException(
            `Stock insuffisant pour "${product.name}" (disponible: ${product.stock})`,
          );
        }
      } else {
        const reserved = await tx.$executeRaw`
          UPDATE "Product"
          SET "reservedStock" = "reservedStock" + ${item.quantity}
          WHERE id = ${product.id}
            AND ("stock" - "reservedStock") >= ${item.quantity}
        `;
        if (reserved === 0) {
          throw new BadRequestException(
            `Stock insuffisant pour "${product.name}" (disponible: ${product.stock - product.reservedStock})`,
          );
        }
      }

      itemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
      totalPrice = totalPrice.add(product.price.mul(item.quantity));
    }

    return tx.order.create({
      data: {
        userId,
        totalPrice,
        paymentMethod: dto.paymentMethod,
        status: isCod ? 'CONFIRMED' : 'PENDING',
        paymentStatus: 'PENDING',
        expiresAt: isCod ? null : new Date(Date.now() + 15 * 60 * 1000),
        shippingFullName: dto.shippingAddress.fullName,
        shippingPhone: dto.shippingAddress.phone,
        shippingAddress: dto.shippingAddress.address,
        shippingCity: dto.shippingAddress.city,
        shippingPostalCode: dto.shippingAddress.postalCode,
        items: { create: itemsData },
      },
      include: {
        items: { include: { product: true } },
        user: true, 
      },
    });
  });

  // Hors transaction : un email raté ne doit jamais affecter la commande déjà créée en base
  if (isCod) {
    this.mailService
      .sendOrderConfirmationEmail(order.user.email, {
        id: order.id,
        totalPrice: Number(order.totalPrice),
        paymentMethod: order.paymentMethod,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
      })
      .catch((err) => this.logger.error('Échec envoi confirmation commande', err));
  }

  return order;
}
async findAllForUser(userId: string, query: QueryOrderDto) {
  const { status, page = 1, limit = 20 } = query;

  const allowedStatuses: OrderStatus[] = ['CONFIRMED', 'SHIPPED', 'DELIVERED'];

  const where: Prisma.OrderWhereInput = {
    userId,
    status: status ? status : { in: allowedStatuses },
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

    async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      await this.reverseStock(id, order);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    });
  }

  async cancelOwnOrder(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) throw new NotFoundException('Commande introuvable');
    if (order.userId !== userId) throw new ForbiddenException('Accès refusé à cette commande');
    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Seule une commande confirmée peut être annulée');
    }

    await this.reverseStock(id, order);

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  private async reverseStock(orderId: string, order: { paymentMethod: string; paymentStatus: string }) {
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });

    // Le stock réel n'a été décrémenté que si : COD (toujours) ou ONLINE déjà payé
    const wasRealStockDecremented =
      order.paymentMethod === 'COD' || order.paymentStatus === 'PAID';

    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: wasRealStockDecremented
            ? { stock: { increment: item.quantity } }
            : { reservedStock: { decrement: item.quantity } },
        }),
      ),
  );
}
  async expirePendingOrder(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      // On relit l'order DANS la transaction pour éviter de traiter
      // une commande qui vient d'être payée entre le scan et l'exécution
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true, payments: { where: { status: 'PENDING' } } },
      });

      if (!order) return;

      // Double vérification : peut-être payée juste avant qu'on exécute ce job
      if (order.paymentStatus === 'PAID' || order.status !== 'PENDING') {
        return;
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { reservedStock: { decrement: item.quantity } },
        });
      }

      // Toute tentative de paiement encore PENDING pour cette commande est aussi périmée
      if (order.payments.length > 0) {
        await tx.payment.updateMany({
          where: { orderId: order.id, status: 'PENDING' },
          data: { status: 'FAILED' },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED', paymentStatus: 'FAILED' },
      });
    });
  }

  async findExpiredPendingOrderIds(): Promise<string[]> {
    const expired = await this.prisma.order.findMany({
      where: {
        status: 'PENDING',
        paymentMethod: 'ONLINE',
        expiresAt: { lt: new Date() },
      },
      select: { id: true },
    });
    return expired.map((o) => o.id);
  }
}