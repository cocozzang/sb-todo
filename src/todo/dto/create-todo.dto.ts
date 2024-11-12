import { PickType } from '@nestjs/mapped-types';
import { TodoEntity } from '../entity';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto extends PickType(TodoEntity, [
  'title',
  'description',
]) {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  startDate: Date | null;

  @IsDate()
  @IsOptional()
  endDate: Date | null;
}
