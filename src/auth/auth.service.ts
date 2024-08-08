import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ProviderEnum, UserEntity } from 'src/user/entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterByCredentialDto } from './dto';
import { ENV_HASH_ROUND_KEY } from 'src/common/const';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async validateByCredential(account: string, password: string) {
    const user = await this.userRepository.findOne({ where: { account } });

    if (!user) return null;

    const isPwdMatch = await bcrypt.compare(password, user.password);

    if (isPwdMatch) return user;

    return null;
  }

  async validateByOauth(
    email: string,
    name: string,
    profileImage: string,
    provider: ProviderEnum,
  ) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) return user;

    const userInstance = this.userRepository.create({
      email,
      name,
      provider,
      profileImage,
    });

    await this.userRepository.insert(userInstance);

    return userInstance;
  }

  async findUserById(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    return user;
  }

  async registerByCredential(dto: RegisterByCredentialDto) {
    const salt = await bcrypt.genSalt(
      +this.configService.get(ENV_HASH_ROUND_KEY),
    );

    const hash = await bcrypt.hash(dto.password, salt);

    const userInstance = this.userRepository.create({
      ...dto,
      password: hash,
      provider: ProviderEnum.CREDENTIAL,
    });

    try {
      await this.userRepository.insert(userInstance);
    } catch (error) {
      if (error.code === '23505')
        throw new UnprocessableEntityException(
          '해당 account는 이미 존재합니다.',
        );

      throw error;
    }

    return userInstance;
  }
}
