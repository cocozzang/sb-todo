import { PartialType } from '@nestjs/mapped-types';
import { StatusEnum, TodoEntity } from '../entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto extends PartialType(TodoEntity) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
