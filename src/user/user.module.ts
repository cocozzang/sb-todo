import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from 'src/todo/entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
