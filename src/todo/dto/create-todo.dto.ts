import { PickType } from '@nestjs/mapped-types';
import { TodoEntity } from '../entity';
import { IsOptional, IsString } from 'class-validator';

export class CreateTodoDto extends PickType(TodoEntity, [
  'title',
  'description',
]) {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
