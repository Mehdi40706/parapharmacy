import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '../../config/config.service';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getFacebookAppId(),
      clientSecret: configService.getFacebookAppSecret(),
      callbackURL: configService.getFacebookCallbackUrl(),
      profileFields: ['id', 'emails', 'name', 'picture'],
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<OAuthProfile> {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Facebook account does not provide an email');
    }

    return {
      provider: 'facebook',
      providerId: profile.id,
      email,
      firstName: profile.name?.givenName ?? 'Facebook',
      lastName: profile.name?.familyName ?? 'User',
      avatarUrl: profile.photos?.[0]?.value,
    };
  }
}