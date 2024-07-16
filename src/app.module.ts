import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ENV_POSTGRES_DB_KEY,
  ENV_POSTGRES_HOST_KEY,
  ENV_POSTGRES_PASSWORD_KEY,
  ENV_POSTGRES_PORT_KEY,
  ENV_POSTGRES_USER_KEY,
} from './common/const';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(ENV_POSTGRES_HOST_KEY),
        port: +configService.get(ENV_POSTGRES_PORT_KEY),
        database: configService.get(ENV_POSTGRES_DB_KEY),
        username: configService.get(ENV_POSTGRES_USER_KEY),
        password: configService.get(ENV_POSTGRES_PASSWORD_KEY),
        synchronize: true,
        entities: [`${__dirname}/**/*.entity{.ts}`], // this will automatically load all entity file in the src folder
      }),
    }),
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
