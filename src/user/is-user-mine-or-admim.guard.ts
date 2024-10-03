import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { RoleEnum, UserEntity } from 'src/user/entity';
import { UserService } from './user.service';

@Injectable()
export class IsUserMineOrAdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UserEntity;
    };

    if (!req.user)
      throw new InternalServerErrorException(
        'public api에 해당 guard를 사용할 수 없습니다.',
      );

    const userId = +req.params['userId'];

    const user = await this.userService.findUserById(userId);

    if (!user) throw new NotFoundException('해당 user는 존재하지 않습니다.');

    if (req.user.role <= RoleEnum.SUB_ADMIN) return true;

    const isMine = user.id === req.user.id;

    if (!isMine)
      throw new ForbiddenException('작성자 본인만 접근가능한 api입니다.');

    return true;
  }
}
