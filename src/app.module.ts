import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Inject,
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
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import { COOKIE_MAX_AGE, ENV_SESSION_SECRET_KEY } from './common/const';
import { UserModule } from './user/user.module';
import * as passport from 'passport';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthenticatedGuard, RoleGuard } from './auth/guard';
import { dataSourceOptions } from '../database/data-source';
import {
  getAllConstraints,
  getCustomValidationError,
} from './common/validation';
import { RedisModule } from './common/redis.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'dev'}`,
    }),
    RedisModule,
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
  constructor(
    private readonly configService: ConfigService,
    @Inject('REDIS_STORE') private readonly redisStore: RedisStore,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: this.redisStore,
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
        cookieParser(),
      )
      .forRoutes('*');
  }
}
