import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '../../config/config.service';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getGoogleClientId(),
      clientSecret: configService.getGoogleClientSecret(),
      callbackURL: configService.getGoogleCallbackUrl(),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<OAuthProfile> {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Google account does not provide an email');
    }

    return {
      provider: 'google',
      providerId: profile.id,
      email,
      firstName: profile.name?.givenName ?? 'Google',
      lastName: profile.name?.familyName ?? 'User',
      avatarUrl: profile.photos?.[0]?.value,
    };
  }
}