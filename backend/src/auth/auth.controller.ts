import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from 'src/users/users.service';
import { RefreshDto } from './dto/refresh.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto'
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import type { OAuthProfile } from './interfaces/oauth-profile.interface';
import { ConfigService } from '../config/config.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() {}

 @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(
    @CurrentUser() profile: OAuthProfile,
    @Res() res
  ) {
    const frontendUrl = this.configService.getFrontendUrl();

    try {
      const tokens = await this.authService.socialLogin(profile);

      const redirectUrl = new URL('/auth/callback', frontendUrl);
      redirectUrl.searchParams.set('access_token', tokens.access_token);
      redirectUrl.searchParams.set('refresh_token', tokens.refresh_token);

      return res.redirect(redirectUrl.toString());
    } catch (error) {
      const errorUrl = new URL('/auth/login', frontendUrl);
      errorUrl.searchParams.set('error', 'google_auth_failed');
      return res.redirect(errorUrl.toString());
    }
  }
  @UseGuards(FacebookAuthGuard)
  @Get('facebook')
  facebookAuth() {}

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/callback')
  facebookAuthCallback(@CurrentUser() profile: OAuthProfile) {
    return this.authService.socialLogin(profile);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: { userId: string }) {
    const fullUser = await this.usersService.findById(user.userId);

    if (!fullUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const { password, ...safeUser } = fullUser;
    return safeUser;
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.usersService.update(user.userId, dto);
    const { password, ...safeUser } = updated;
    return safeUser;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @CurrentUser() user: { userId: string },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.userId, dto.currentPassword, dto.newPassword);
  }

  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refresh_token);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(dto.email);
  }
  
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}