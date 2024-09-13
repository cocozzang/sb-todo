import { PartialType } from '@nestjs/mapped-types';
import { StatusEnum, TodoEntity } from '../entity';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

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

  @IsDate()
  @IsOptional()
  startDate: Date | null;

  @IsDate()
  @IsOptional()
  endDate: Date | null;
}
