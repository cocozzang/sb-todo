import { DataSource } from 'typeorm';
import { RegisterByCredentialDto } from '../../src/auth/dto';
import * as request from 'supertest';

const getSessionCookie = async (
  user: RegisterByCredentialDto,
  isAdmin: boolean,
  server: any,
  dataSource?: DataSource,
) => {
  await request(server).post('/auth/register/credential').send(user);

  if (isAdmin) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.query(`UPDATE "user" SET role = '1' WHERE id = 1`);

    await queryRunner.query(`SELECT * FROM "user"`);

    await queryRunner.release();
  }

  await request(server).post('/auth/login/credential').send(user);

  const loginResponse = await request(server)
    .post('/auth/login/credential')
    .send({ account: user.account, password: user.password });

  const cookie = loginResponse.headers['set-cookie'];

  return cookie;
};

export { getSessionCookie };
