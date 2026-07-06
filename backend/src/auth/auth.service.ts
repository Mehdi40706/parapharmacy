import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    return this.generateTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    return this.generateTokens(
      stored.user.id,
      stored.user.email,
      stored.user.role,
    );
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refresh_token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId,
        expiresAt,
      },
    });

    return { access_token, refresh_token };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);

    // On ne révèle jamais si l'email existe ou non (sécurité)
    if (!user) {
      return { message: 'Si ce compte existe, un email a été envoyé.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1h

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Si ce compte existe, un email a été envoyé.' };
  }

  async resetPassword(token: string, newPassword: string) {
  const user = await this.prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new UnauthorizedException('Token invalide ou expiré');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: 'Mot de passe mis à jour avec succès' };
}
}