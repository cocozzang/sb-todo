import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

async function bootstrap() {
  const ENV = process.env.NODE_ENV;
  const conf = config({ path: !ENV ? '.env.dev' : `.env.${ENV}` });
  dotenvExpand.expand(conf);

  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

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
    `PROFILE: ${process.env.PROFILE ?? 'DEV'}, PORT: ${port}, Listining on ${await app.getUrl()}`,
  );
}

bootstrap();
