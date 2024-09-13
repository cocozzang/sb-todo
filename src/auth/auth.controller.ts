import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterByCredentialDto } from './dto';
import { CredentialGuard, GoogleGuard } from './guard';
import { IsPublic } from './decorator';
import { UserEntity } from '../user/entity';
import { COOKIE_MAX_AGE, ENV_CLIENT_URL_KEY } from '../common/const';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @IsPublic()
  @UseGuards(GoogleGuard)
  @Get('login/google')
  loginByGoogle() {}

  @IsPublic()
  @UseGuards(GoogleGuard)
  @Get('login/google/callback')
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserEntity;

    req.res.cookie(
      'user.info',
      JSON.stringify({
        id: user.id,
        name: user.name,
        role: user.role,
        profile: user.profileImage,
      }),
      {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
      },
    );

    res.redirect(this.configService.get(ENV_CLIENT_URL_KEY));
  }

  @IsPublic()
  @UseGuards(CredentialGuard)
  @Post('login/credential')
  loginByCredential(@Req() req: Request) {
    const user = req.user as UserEntity;

    req.res.cookie(
      'user.info',
      JSON.stringify({
        id: user.id,
        name: user.name,
        role: user.role,
        profile: user.profileImage,
      }),
      {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
      },
    );

    return;
  }

  @IsPublic()
  @Post('register/credential')
  async registerByCredential(@Body() dto: RegisterByCredentialDto) {
    await this.authService.registerByCredential(dto);

    return;
  }

  @Get('status')
  getStatus(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {});
    res.clearCookie('connect.sid');
    res.send({ msg: 'logout 성공' });
  }
}
