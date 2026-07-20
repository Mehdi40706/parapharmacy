import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findFirst({ where: { googleId } });
  }

  async findByFacebookId(facebookId: string) {
    return this.prisma.user.findFirst({ where: { facebookId } });
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async createOAuthUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    googleId?: string;
    facebookId?: string;
  }) {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    return this.prisma.user.create({
      data,
    });
  }

  async linkGoogleId(userId: string, googleId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });
  }

  async linkFacebookId(userId: string, facebookId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { facebookId },
    });
  }

  async update(id: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findAll(query: { page?: number; limit?: number; search?: string }) {
  const { page = 1, limit = 20, search } = query;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' as const } },
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    this.prisma.user.count({ where }),
  ]);

  return {
    data: items,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

async updateRole(id: string, role: 'CLIENT' | 'ADMIN') {
  return this.prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, email: true, role: true },
  });
}

async deleteUser(id: string) {
  return this.prisma.user.delete({
    where: {id}
  });
}
}