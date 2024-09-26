import { RegisterByCredentialDto } from '../../src/auth/dto';
import * as request from 'supertest';

const getSessionCookie = async (user: RegisterByCredentialDto, server: any) => {
  await request(server).post('/auth/register/credential').send(user);
  await request(server).post('/auth/login/credential').send(user);

  const loginResponse = await request(server)
    .post('/auth/login/credential')
    .send({ account: user.account, password: user.password });

  const cookie = loginResponse.headers['set-cookie'];

  return cookie;
};

export { getSessionCookie };
