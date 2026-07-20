import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/mail/mail.service';
import { OAuthProfile } from './interfaces/oauth-profile.interface';

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
    return this.generateTokens(this.prisma, user.id, user.email, user.role);
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
    return this.generateTokens(this.prisma, user.id, user.email, user.role);
}

  async socialLogin(profile: OAuthProfile) {
    const user = await this.findOrCreateSocialUser(profile);
    return this.generateTokens(this.prisma, user.id, user.email, user.role);
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
    return this.prisma.$transaction(async (prisma) => {
      await prisma.refreshToken.delete({ where: { id: stored.id } });

      const user = await prisma.user.findUnique({
        where: { id: stored.userId },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedException('Utilisateur introuvable');
      }
      return this.generateTokens(prisma, user.id, user.email, user.role);
    });
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }

  private async findOrCreateSocialUser(profile: OAuthProfile) {
    const providerUser =
      profile.provider === 'google'
        ? await this.usersService.findByGoogleId(profile.providerId)
        : await this.usersService.findByFacebookId(profile.providerId);
    if (providerUser) {
      return providerUser;
    }
    const emailUser = await this.usersService.findByEmail(profile.email);
    if (emailUser) {
      return profile.provider === 'google'
        ? this.usersService.linkGoogleId(emailUser.id, profile.providerId)
        : this.usersService.linkFacebookId(emailUser.id, profile.providerId);
    }
    const randomPassword = await bcrypt.hash(
      crypto.randomBytes(32).toString('hex'),
      10,
    );
    return this.usersService.createOAuthUser({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      password: randomPassword,
      googleId: profile.provider === 'google' ? profile.providerId : undefined,
      facebookId: profile.provider === 'facebook' ? profile.providerId : undefined,
    });
  }

  private async generateTokens(
    prisma: Prisma.TransactionClient | PrismaService,
    userId: string,
    email: string,
    role: Role,
  ) {
    const payload = { sub: userId, email, role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = crypto.randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(refresh_token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });
    return { access_token, refresh_token };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Aucun compte associé à cet email');
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

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }
    const passwordValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { message: 'Mot de passe mis à jour avec succès' };
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
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      }),
      this.prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}