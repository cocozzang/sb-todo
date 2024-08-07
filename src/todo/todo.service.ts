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

  findAllMyTodo(userId: number) {
    return this.todoRepository.find({ where: { author: { id: userId } } });
  }

  findAllTodoForAdmin() {
    return this.todoRepository.find();
  }

  findTodoById(todoId: number) {
    return this.todoRepository.findOne({
      where: { id: todoId },
      relations: { author: true },
    });
  }

  async createTodo(dto: CreateTodoDto, userId: number) {
    const todoInstance = this.todoRepository.create({
      ...dto,
      author: { id: userId },
    });

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
