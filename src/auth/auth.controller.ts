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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('login/google')
  loginByGoogle() {}

  @UseGuards(GoogleGuard)
  @Get('login/google/callback')
  googleCallback() {
    return { msg: 'success to login' };
  }

  @UseGuards(CredentialGuard)
  @Post('login/credential')
  loginByCredential() {
    return;
  }

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
