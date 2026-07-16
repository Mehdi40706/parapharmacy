import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { EmbeddingsService } from 'src/embeddings/embeddings.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private embeddingsService: EmbeddingsService,
  ) {}

  // 1. Updated helper to accept the loaded category object safely
  private buildEmbeddingText(product: { 
    name: string; 
    description?: string | null; 
    category?: { name: string } | null 
  }): string {
    return [product.name, product.category?.name, product.description]
      .filter(Boolean)
      .join('. ');
  }

private async updateEmbedding(productId: string) {
    try {
      const product = await this.prisma.product.findUnique({ 
        where: { id: productId },
        include: { category: true } 
      });
      if (!product) return;

      const text = this.buildEmbeddingText(product);
      const embedding = await this.embeddingsService.embedProduct(text);

      if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
        throw new Error("L'embedding reçu de Voyage AI est vide ou invalide.");
      }

      console.log(`[Embedding Debug] Dimensions reçues : ${embedding.length} pour le produit ${productId}`);

      const vectorString = `[${embedding.join(',')}]`;

      await this.prisma.$executeRawUnsafe(
        `UPDATE "Product" SET embedding = $1::vector WHERE id = $2`,
        vectorString,
        productId,
      );

      console.log(`[Embedding Success] Produit ${productId} mis à jour avec succès.`);
    } catch (error: unknown) {
      // 1. Narrow the type of 'error' to safely read '.message'
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(
        `[Embedding Error] Échec de la génération/sauvegarde pour le produit ${productId}:`,
        errorMessage
      );
    }
  }
  private slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async findAll(query: QueryProductDto) {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const where: Prisma.ProductWhereInput = {
      isActive: true, 
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllAdmin(query: QueryProductDto) {
    const { search, categoryId, page = 1, limit = 20 } = query;

    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId }),
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }
    return product;
  }

  // 3. Cleaned async/await execution sequence
  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new BadRequestException('Catégorie invalide');
    }

    const slug = this.slugify(dto.name);

    // Explicitly await the database creation first
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        stock: dto.stock ?? 0,
        imageUrl: dto.imageUrl,
        categoryId: dto.categoryId,
        usageInstructions: dto.usageInstructions,
      },
      include: { category: true },
    });

    // Run embedding update safely on the resolved entity
    await this.updateEmbedding(product.id);
    return product;
  }

  // 4. Cleaned async/await update execution sequence
  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new BadRequestException('Catégorie invalide');
      }
    }
    
    const data: Prisma.ProductUpdateInput = { ...dto } as Prisma.ProductUpdateInput;
    if (dto.name) {
      data.slug = this.slugify(dto.name);
    }

    // Explicitly await the database update first
    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    await this.updateEmbedding(product.id);
    return product;
  }

  async archive(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: { category: true },
    });
  }
  
  async restore(id: string) {
    await this.findOne(id);
    
    return this.prisma.product.update({
      where: { id },
      data: { isActive: true },
      include: { category: true },
    });
  }
  
  async remove(id: string) {
    await this.findOne(id);

    const orderItemsCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
       throw new ConflictException(
        'Impossible de supprimer ce produit car il fait partie de commandes existantes.',
      );
    }
    return this.prisma.product.delete({ where: { id } });
  }

  async reserveStock(
    productId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prisma;

    const result = await db.$executeRaw`
      UPDATE "Product"
      SET "reservedStock" = "reservedStock" + ${quantity}
      WHERE id = ${productId}
        AND ("stock" - "reservedStock") >= ${quantity}
    `;

    if (result === 0) {
      const product = await db.product.findUnique({ where: { id: productId } });
      const name = product?.name ?? productId;
      throw new BadRequestException(`Stock insuffisant pour "${name}"`);
    }
  }

  async releaseStock(
    productId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prisma;
    await db.product.update({
      where: { id: productId },
      data: { reservedStock: { decrement: quantity } },
    });
  }

  async confirmStock(
    productId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prisma;
    await db.product.update({
      where: { id: productId },
      data: {
        stock: { decrement: quantity },
        reservedStock: { decrement: quantity },
      },
    });
  }

  async decrementStock(
    productId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prisma;

    const result = await db.product.updateMany({
      where: { id: productId, stock: { gte: quantity } },
      data: { stock: { decrement: quantity } },
    });

    if (result.count === 0) {
      const product = await db.product.findUnique({ where: { id: productId } });
      const name = product?.name ?? productId;
      throw new BadRequestException(`Stock insuffisant pour "${name}"`);
    }
  }

  async semanticSearch(query: string, limit = 5) {
    const queryEmbedding = await this.embeddingsService.embedQuery(query);
    const vectorLiteral = `[${queryEmbedding.join(',')}]`;
    const results = await this.prisma.$queryRawUnsafe<
      {
        id: string;
        name: string;
        price: number;
        slug: string;
        description: string | null;
        distance: number;
      }[]
    >(
      `
      SELECT
        id,
        name,
        price,
        description,
        slug,
        (embedding <=> $1::vector) AS distance
      FROM "Product"
      WHERE embedding IS NOT NULL
        AND stock > 0
      ORDER BY embedding <=> $1::vector
      LIMIT $2
      `,
      vectorLiteral,
      limit,
    );

    return results;
  }
}