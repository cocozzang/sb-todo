import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import {
  ENV_GOOGLE_CALLBACK_URL_KEY,
  ENV_GOOGLE_CLIENT_ID_KEY,
  ENV_GOOGLE_SECRET_KEY,
} from 'src/common/const';
import { AuthService } from '../auth.service';
import { ProviderEnum } from 'src/user/entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get(ENV_GOOGLE_CLIENT_ID_KEY),
      clientSecret: configService.get(ENV_GOOGLE_SECRET_KEY),
      callbackURL: configService.get(ENV_GOOGLE_CALLBACK_URL_KEY),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { email, name, profile: profileImage } = profile._json;

    const user = await this.authService.validateByOauth(
      email,
      name,
      profileImage,
      ProviderEnum.GOOGLE,
    );

    return user;
  }
}
