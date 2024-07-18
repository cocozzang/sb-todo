import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from './entity';
import { Repository } from 'typeorm';
import { CreateTodoDto, UpdateTodoDto } from './dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  findAllTodo() {
    return this.todoRepository.find();
  }

  findTodoById(todoId: number) {
    return this.todoRepository.findOne({ where: { id: todoId } });
  }

  async createTodo(dto: CreateTodoDto) {
    const todoInstance = this.todoRepository.create(dto);

    await this.todoRepository.insert(todoInstance);

    return todoInstance;
  }

  async updateTodo(todoId: number, dto: UpdateTodoDto) {
    const updateResult = await this.todoRepository.update({ id: todoId }, dto);

    return updateResult.affected === 0 ? false : true;
  }

  async removeTodo(todoId: number) {
    await this.todoRepository.delete({ id: todoId });

    return true;
  }
}
