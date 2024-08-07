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
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { RoleEnum, UserEntity } from 'src/user/entity';
import { AccessLevel, User } from 'src/auth/decorator';
import { SessionUser } from 'src/auth/serializer';

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

  @Get(':todoId')
  async getTodoById(@Param('todoId', ParseIntPipe) todoId: number) {
    const feed = await this.todoService.findTodoById(todoId);

    if (!feed)
      throw new NotFoundException(
        `해당 todoId: ${todoId} 는 존재하지 않습니다.`,
      );

    return feed;
  }

  @Post()
  postTodo(@Body() dto: CreateTodoDto, @User() user: UserEntity) {
    return this.todoService.createTodo(dto, user.id);
  }

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

  @Delete(':todoId')
  deleteTodoById(@Param('todoId', ParseIntPipe) todoId: number) {
    return this.todoService.removeTodo(todoId);
  }
}
