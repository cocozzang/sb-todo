import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import * as redis from 'redis';
import { dataSource } from '../database/data-source';
import { getSessionCookie, user, user2 } from './utils';
import { UpdateUserDto } from '../src/user/dto';
import { notValidData } from './utils/data';

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let redisClient: redis.RedisClientType;
  let server: any;
  let cookie: string;
  let cookie2: string;

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

  const updateUserDto: UpdateUserDto = { name: 'edited name', password: '234' };

  describe('Preprocess for test', () => {
    it('login and store cookies', async () => {
      cookie = await getSessionCookie(user, server);
      cookie2 = await getSessionCookie(user2, server);
    });
  });

  describe('GET - /user/:id', () => {
    //로그인 후 받은 쿠키 포함해서 요청 보내기 login부터 해보자
    it('request success, 200', async () => {
      await request(server).get('/user/1').set('Cookie', cookie).expect(200);
    });

    it('not found, 404', () => {
      return request(server).get('/user/404').set('Cookie', cookie).expect(404);
    });

    it('not authenticated, 401', () => {
      return request(server).get('/user/1').expect(401);
    });

    it('not authorized, 403', () => {
      return request(server).get('/user/1').set('Cookie', cookie2).expect(403);
    });
  });

  describe('PATCH - /user/:id', () => {
    it('request success, 200', () => {
      return request(server)
        .patch('/user/1')
        .set('Cookie', cookie)
        .send(updateUserDto)
        .expect(200);
    });

    it('not valid request body, 422', () => {
      return request(server)
        .patch('/user/1')
        .set('Cookie', cookie)
        .send(notValidData)
        .expect(422);
    });

    it('not found, 404', () => {
      return request(server)
        .patch('/user/404')
        .set('Cookie', cookie)
        .expect(404);
    });

    it('not authenticated, 401', () => {
      return request(server).patch('/user/1').send(updateUserDto).expect(401);
    });

    it('not authorized, 403', () => {
      return request(server)
        .patch('/user/1')
        .set('Cookie', cookie2)
        .expect(403);
    });
  });

  describe('DELETE - /user/:id', () => {
    it('not found, 404', () => {
      return request(server)
        .delete('/user/404')
        .set('Cookie', cookie)
        .expect(404);
    });

    it('not authenticated, 401', () => {
      return request(server).delete('/user/1').expect(401);
    });

    it('not authorized, 403', () => {
      return request(server)
        .delete('/user/1')
        .set('Cookie', cookie2)
        .expect(403);
    });

    it('request success, 200', () => {
      return request(server)
        .delete('/user/1')
        .set('Cookie', cookie)
        .expect(200);
    });
  });
});