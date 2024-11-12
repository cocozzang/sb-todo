import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

// 배포만 하려면 commit에 tag달고 push해야하는건가; 리트1
async function bootstrap() {
  const conf = config({ path: `.env.${process.env.NODE_ENV ?? 'dev'}` });
  dotenvExpand.expand(conf);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  let port: number;

  if (process.env.PROFILE === 'blue') {
    port = +process.env.BLUE_PORT;
  } else if (process.env.PROFILE === 'green') {
    port = +process.env.GREEN_PORT;
  } else {
    port = 3000;
  }

  const logger = new Logger('bootstrap');

  await app.listen(port);

  logger.verbose(
    `PROFILE: ${process.env.PROFILE}, PORT: ${port}, Listining on ${await app.getUrl()}`,
  );
}

bootstrap();
