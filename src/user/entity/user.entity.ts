import { UnprocessableEntityException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/entity';
import { TodoEntity } from 'src/todo/entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

export enum ProviderEnum {
  CREDENTIAL = 'CREDENTIAL',
  GOOGLE = 'GOOGLE',
}

export enum RoleEnum {
  ADMIN = 1,
  SUB_ADMIN,
  USER,
}

/**
 * User class 는 2종류의 인스턴스를 생성합니다.
 * 1. Credential로 회원가입한 유저 (account, password 필수)
 * 2. OAuth로 회원가입한 유저 (email필수)
 */
@Entity({ name: 'user' })
export class UserEntity extends BaseModel {
  @Column({ nullable: true, unique: true })
  account?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column()
  name: string;

  @Column({ nullable: true, name: 'profile_image' })
  profileImage: string;

  @Column({
    type: 'enum',
    enum: ProviderEnum,
    default: ProviderEnum.CREDENTIAL,
  })
  provider: ProviderEnum;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @OneToMany(() => TodoEntity, (todo) => todo.author, { cascade: true })
  todos: TodoEntity[];

  @BeforeInsert()
  validateCredentialOrOAuth() {
    if (
      this.provider === ProviderEnum.CREDENTIAL &&
      (!this.account || !this.password)
    ) {
      throw new UnprocessableEntityException(
        'Credential User는 account와 password가 필요합니다.',
      );
    }

    if (this.provider !== ProviderEnum.CREDENTIAL && !this.email) {
      throw new UnprocessableEntityException(
        'Oauth User는 email값이 필요합니다.',
      );
    }
  }
}
