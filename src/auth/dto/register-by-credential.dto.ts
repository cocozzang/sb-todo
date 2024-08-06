import { IsOptional, IsString } from 'class-validator';

export class RegisterByCredentialDto {
  @IsString()
  account: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
