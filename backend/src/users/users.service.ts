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
  async update(id: string, data: { firstName?: string; lastName?: string; phone?: string }) {
  return this.prisma.user.update({
    where: { id },
    data,
  });
}
}