import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'database/data-source';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get(ENV_POSTGRES_HOST_KEY),
    //     port: +configService.get(ENV_POSTGRES_PORT_KEY),
    //     database: configService.get(ENV_POSTGRES_DB_KEY),
    //     username: configService.get(ENV_POSTGRES_USER_KEY),
    //     password: configService.get(ENV_POSTGRES_PASSWORD_KEY),
    //     synchronize: true,
    //     entities: [`${__dirname}/**/*.entity{.ts}`], // this will automatically load all entity file in the src folder
    //   }),
    // }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
