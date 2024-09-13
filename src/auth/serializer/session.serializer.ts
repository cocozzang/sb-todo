import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { DoneCallback } from 'passport';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/user/entity';

export type SessionUser = Pick<
  UserEntity,
  'id' | 'account' | 'email' | 'name' | 'role'
>;

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: UserEntity, done: DoneCallback) {
    done(null, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profileImage: user.profileImage,
      provider: user.provider,
    });
  }

  async deserializeUser(sessionUser: SessionUser, done: DoneCallback) {
    // user정보가 session으로 serialize될때 db에서 정보를 확인과정이 있는데
    // session으로 부터 user저오를 deserilize 할때도 db에서 값을 재확인해야할 필요가 있을까?
    // const userDB = await this.authService.findUserById(user.id);
    //
    return sessionUser ? done(null, sessionUser) : done(null, null);
  }
}
