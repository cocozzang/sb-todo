import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { RoleEnum, UserEntity } from 'src/user/entity';
import { AccessLevel, User } from 'src/auth/decorator';
import { SessionUser } from 'src/auth/serializer';
import { IsTodoMineOrAdminGuard } from './guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllMyTodo(@User() user: SessionUser) {
    return this.todoService.findAllMyTodo(user.id);
  }

  @AccessLevel(RoleEnum.SUB_ADMIN)
  @Get('all')
  getAllTodoForAdmin() {
    return this.todoService.findAllTodoForAdmin();
  }

  @UseGuards(IsTodoMineOrAdminGuard)
  @Get(':todoId')
  async getTodoById(@Param('todoId', ParseIntPipe) todoId: number) {
    const todo = await this.todoService.findTodoById(todoId);

    if (!todo)
      throw new NotFoundException(
        `해당 todoId: ${todoId} 는 존재하지 않습니다.`,
      );

    return todo;
  }

  @Post()
  postTodo(@Body() dto: CreateTodoDto, @User() user: UserEntity) {
    return this.todoService.createTodo(dto, user.id);
  }

  @UseGuards(IsTodoMineOrAdminGuard)
  @Patch(':todoId')
  async patchTodoById(
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() dto: UpdateTodoDto,
  ) {
    const res = await this.todoService.updateTodo(todoId, dto);

    if (!res)
      throw new NotFoundException(
        `해당 todoId: ${todoId} 는 존재하지 않습니다.`,
      );

    return true;
  }

  @UseGuards(IsTodoMineOrAdminGuard)
  @Delete(':todoId')
  async deleteTodoById(@Param('todoId', ParseIntPipe) todoId: number) {
    const deleteResult = await this.todoService.removeTodo(todoId);

    if (!deleteResult.affected)
      throw new NotFoundException('해당 todo는 존재하지않습니다.');

    return true;
  }
}
