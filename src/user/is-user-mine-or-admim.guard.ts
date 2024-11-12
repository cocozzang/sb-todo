import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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

    // validation pipe가 해당에러를 처리하도록 guard를 그냥 통과 시킵니다.
    // 적절한 접근방법인지 잘 모르겠네용.
    if (isNaN(userId)) return true;

    if (req.user.role <= RoleEnum.SUB_ADMIN) return true;

    const isMine = userId === req.user.id;

    if (!isMine)
      throw new ForbiddenException('작성자 본인만 접근가능한 api입니다.');

    return true;
  }
}
