import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ACCESS_LEVEL_KEY } from '../decorator';
import { Request } from 'express';
import { RoleEnum } from 'src/user/entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: { role: RoleEnum };
    };

    const requiredAccessLevel = this.reflector.getAllAndOverride<RoleEnum>(
      ACCESS_LEVEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredAccessLevel) return true;

    if (req.user.role > requiredAccessLevel)
      throw new ForbiddenException('권한부족, 해당 api에 접근 할 수 없습니다.');

    return true;
  }
}
