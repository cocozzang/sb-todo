import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import * as redis from 'redis';
import { dataSource } from '../database/data-source';
import {
  editedTodo,
  getSessionCookie,
  notValidData,
  todo,
  todo2,
  user,
  user2,
} from './utils';

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let redisClient: redis.RedisClientType;
  let server: any;
  let adminCookie: string;
  let userCookie: string;

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

  describe('Preprocess for test', () => {
    it('login and store cookies', async () => {
      adminCookie = await getSessionCookie(user, true, server, dataSource);
      userCookie = await getSessionCookie(user2, false, server);
    });
  });

  describe('POST - /todo', () => {
    //로그인 후 받은 쿠키 포함해서 요청 보내기 login부터 해보자
    it('request success, 201', async () => {
      await request(app.getHttpServer())
        .post('/todo')
        .set('Cookie', adminCookie)
        .send(todo)
        .expect(201);

      await request(app.getHttpServer())
        .post('/todo')
        .set('Cookie', adminCookie)
        .send(todo2)
        .expect(201);
    });

    it('유효하지 않은 request body, 422', () => {
      return request(app.getHttpServer())
        .post('/todo')
        .set('Cookie', adminCookie)
        .send(notValidData)
        .expect(422);
    });

    it('not authenticated, 401', () => {
      return request(app.getHttpServer()).post('/todo').expect(401);
    });
  });

  describe('GET - /todo', () => {
    it('request success 200', async () => {
      const res = await request(app.getHttpServer())
        .get('/todo')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);

      expect(res.body[0]).toMatchObject({
        ...todo2,
        startDate: todo2.startDate.toISOString(),
        endDate: todo2.endDate.toISOString(),
      });

      expect(res.body[1]).toMatchObject({
        ...todo,
        startDate: todo.startDate.toISOString(),
        endDate: todo.endDate.toISOString(),
      });
    });

    it('not authenticated, 401', () => {
      return request(app.getHttpServer()).get('/todo').expect(401);
    });
  });

  describe('GET - /todo:id', () => {
    it('request success, 200', async () => {
      const res = await request(app.getHttpServer())
        .get('/todo/1')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body).toMatchObject({
        ...todo,
        startDate: todo.startDate.toISOString(),
        endDate: todo.endDate.toISOString(),
      });
    });

    it('not found, 404', () => {
      return request(app.getHttpServer())
        .get('/todo/404')
        .set('Cookie', adminCookie)
        .expect(404);
    });

    it('not authenticated, 401', () => {
      return request(app.getHttpServer()).get('/todo/1').expect(401);
    });

    it('not authorized, 403', () => {
      return request(app.getHttpServer())
        .get('/todo/1')
        .set('Cookie', userCookie)
        .expect(403);
    });
  });

  describe('PATCH - /todo:id', () => {
    it('request success, 200', async () => {
      await request(app.getHttpServer())
        .patch('/todo/1')
        .set('Cookie', adminCookie)
        .send(editedTodo);

      const res = await request(app.getHttpServer())
        .get('/todo/1')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body).toMatchObject({
        ...editedTodo,
        startDate: editedTodo.startDate.toISOString(),
        endDate: editedTodo.endDate.toISOString(),
      });
    });

    it('유효하지않은 request body, 422', () => {
      return request(server)
        .patch('/todo/1')
        .set('Cookie', adminCookie)
        .send(notValidData)
        .expect(422);
    });

    it('not found, 404', () => {
      return request(app.getHttpServer())
        .patch('/todo/404')
        .set('Cookie', adminCookie)
        .expect(404);
    });

    it('not authenticated, 401', () => {
      return request(app.getHttpServer()).patch('/todo/1').expect(401);
    });

    it('not authorized, 403', () => {
      return request(app.getHttpServer())
        .patch('/todo/1')
        .set('Cookie', userCookie)
        .expect(403);
    });
  });

  describe('DELETE - /todo:id', () => {
    it('request success, 200', async () => {
      await request(app.getHttpServer())
        .delete('/todo/1')
        .set('Cookie', adminCookie)
        .expect(200);

      const res = await request(app.getHttpServer())
        .get('/todo')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0]).toMatchObject({
        ...todo2,
        startDate: todo2.startDate.toISOString(),
        endDate: todo2.endDate.toISOString(),
      });
    });

    it('not found, 404', () => {
      return request(app.getHttpServer())
        .delete('/todo/404')
        .set('Cookie', adminCookie)
        .expect(404);
    });

    it('not authenticated, 401', () => {
      return request(app.getHttpServer()).delete('/todo/2').expect(401);
    });

    it('not authorized, 403', () => {
      return request(app.getHttpServer())
        .delete('/todo/2')
        .set('Cookie', userCookie)
        .expect(403);
    });
  });
});
