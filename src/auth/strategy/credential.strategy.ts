import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class CredentialStrategy extends PassportStrategy(
  Strategy,
  'credential',
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'account',
      passwordField: 'password',
    });
  }

  async validate(account: string, password: string) {
    const user = await this.authService.validateByCredential(account, password);

    if (!user)
      throw new UnauthorizedException('잘못된 아이디 또는 비밀번호 입니다.');

    return user;
  }
}
