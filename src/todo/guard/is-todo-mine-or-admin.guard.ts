import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TodoService } from '../todo.service';
import { Request } from 'express';
import { RoleEnum, UserEntity } from 'src/user/entity';

@Injectable()
export class IsTodoMineOrAdminGuard implements CanActivate {
  constructor(private readonly todoService: TodoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UserEntity;
    };

    if (!req.user)
      throw new InternalServerErrorException(
        'public api에 해당 guard를 사용할 수 없습니다.',
      );

    const todoId = +req.params['todoId'];

    // validation pipe에서 error처리하도록 하자
    if (isNaN(todoId)) return true;

    if (req.user.role <= RoleEnum.SUB_ADMIN) return true;

    const todo = await this.todoService.findTodoById(todoId);

    if (!todo) throw new NotFoundException('해당 todo는 존재하지 않습니다.');

    const isMine = todo.author.id === req.user.id;

    if (!isMine)
      throw new ForbiddenException('작성자 본인만 접근가능한 api입니다.');

    return true;
  }
}
