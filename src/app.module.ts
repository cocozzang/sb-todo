import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from 'database/data-source';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import * as redis from 'redis';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import {
  ENV_REDIS_PASSWORD_KEY,
  ENV_REDIS_URI_KEY,
  ENV_SESSION_SECRET_KEY,
} from './common/const';
import { UserModule } from './user/user.module';
import * as passport from 'passport';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticatedGuard, RoleGuard } from './auth/guard';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TodoModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
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
            maxAge: 300000, // 5분
          },
          rolling: true,
        }),

        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
