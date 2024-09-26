import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import * as redis from 'redis';
import { dataSource } from '../database/data-source';
import { user } from './utils';

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let redisClient: redis.RedisClientType;
  let server: any;
  let cookie: string;

  beforeAll(async () => {
    await dataSource.initialize();

    redisClient = redis.createClient({
      url: process.env.REDIS_URI,
      password: process.env.REDIS_PASSWORD,
    });

    await redisClient.connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await redisClient.sendCommand(['FLUSHALL']);
    await redisClient.disconnect();
    await app.close();
  });

  const notValideUser = {
    notvaliadprops: 'not valid',
  };

  describe('POST - /auth/register/credential', () => {
    it('request success, 201', () => {
      return request(server)
        .post('/auth/register/credential')
        .send(user)
        .expect(201);
    });

    it('account가 이미 존재합니다, 409', () => {
      return request(server)
        .post('/auth/register/credential')
        .send(user)
        .expect(409);
    });

    it('유효하지않은 request body, 400', () => {
      return request(server)
        .post('/auth/register/credential')
        .send(notValideUser)
        .expect(400);
    });
  });

  describe('POST - /auth/login/credential', () => {
    it('request success, 201', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login/credential')
        .send({ account: user.account, password: user.password })
        .expect(201);

      cookie = loginResponse.headers['set-cookie'];

      const [userInfo, sessionCookie] = loginResponse.headers['set-cookie'];

      expect(userInfo).toContain('user.info');
      expect(sessionCookie).toContain('connect.sid');
    });

    it('login 정보가 다릅니다, 401', () => {
      return request(server)
        .post('/auth/login/credential')
        .send({ account: 'coco1', password: '123' })
        .expect(401);
    });
  });

  describe('POST - /auth/logout', () => {
    it('request success, 201', async () => {
      console.log(cookie);
      const res = await request(server)
        .post('/auth/logout')
        .set('Cookie', cookie);

      expect(res.status).toEqual(201);
    });

    it('session cookie가 없는 경우, 401', async () => {
      console.log(cookie);
      const res = await request(server).post('/auth/logout');

      expect(res.status).toEqual(401);
    });
  });
});
