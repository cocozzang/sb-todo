import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const ENV = process.env.NODE_ENV ?? 'dev';
const conf = config({ path: `.env.${ENV}` });
dotenvExpand.expand(conf);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  synchronize: ENV === 'test' ? true : false,
  entities: ENV === 'test' ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
