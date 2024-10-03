import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import * as redis from 'redis';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import {
  COOKIE_MAX_AGE,
  ENV_REDIS_PASSWORD_KEY,
  ENV_REDIS_URI_KEY,
  ENV_SESSION_SECRET_KEY,
} from './common/const';
import { UserModule } from './user/user.module';
import * as passport from 'passport';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthenticatedGuard, RoleGuard } from './auth/guard';
import { dataSourceOptions } from '../database/data-source';
import {
  getAllConstraints,
  getCustomValidationError,
} from './common/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'dev'}`,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TodoModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors: ValidationError[]) =>
          new HttpException(
            getCustomValidationError(getAllConstraints(errors)),
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
      }),
    },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_GUARD, useClass: AuthenticatedGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    AppService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const redisClient = redis.createClient({
      url: this.configService.get(ENV_REDIS_URI_KEY),
      password: this.configService.get(ENV_REDIS_PASSWORD_KEY),
    });

    redisClient.connect().catch(console.error);

    const redisStore = new RedisStore({ client: redisClient });

    consumer
      .apply(
        session({
          store: redisStore,
          resave: false,
          saveUninitialized: false,
          secret: this.configService.get(ENV_SESSION_SECRET_KEY),
          cookie: {
            httpOnly: true,
            maxAge: COOKIE_MAX_AGE, // one day
            secure: false,
            sameSite: 'lax',
          },
          rolling: false,
        }),

        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
