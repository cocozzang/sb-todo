import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from '../entity';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PickType(UserEntity, ['name']) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  password?: string;
}
