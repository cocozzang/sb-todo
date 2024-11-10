import { Injectable } from '@nestjs/common';
import { UserEntity } from './entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async findUserById(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUser(dto: UpdateUserDto, userId: number) {
    if (dto.password) {
      const hash = await this.authService.hashPassword(dto.password);

      dto = { ...dto, password: hash };
    }

    const updateResult = await this.userRepository.update({ id: userId }, dto);

    return updateResult;
  }

  async deleteUser(userId: number) {
    await this.userRepository.delete({ id: userId });

    return true;
  }
}
