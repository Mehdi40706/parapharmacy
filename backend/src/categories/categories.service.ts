import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private slugify(name: string): string {
    const base = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return base || `categorie-${Date.now().toString(36)}`;
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.slugify(dto.name);

    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException('Une catégorie avec ce nom existe déjà');
    }
    return this.prisma.category.create({
      data: { name: dto.name, slug },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    const data: { name?: string; slug?: string } = {};
    if (dto.name) {
      const slug = this.slugify(dto.name);

      const existing = await this.prisma.category.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Une catégorie avec ce nom existe déjà');
      }

      data.name = dto.name;
      data.slug = slug;
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);

    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new ConflictException(
        `Impossible de supprimer cette catégorie : ${productsCount} produit(s) y sont rattachés.`,
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }
}