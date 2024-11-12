import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';
import RedisStore from 'connect-redis'; // express-session용 redis store
import { ENV_REDIS_PASSWORD_KEY, ENV_REDIS_URI_KEY } from './const';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisClient = redis.createClient({
          url: configService.get(ENV_REDIS_URI_KEY),
          password: configService.get(ENV_REDIS_PASSWORD_KEY),
        });

        await redisClient.connect().catch(console.error);
        return redisClient;
      },
    },
    {
      provide: 'REDIS_STORE',
      inject: ['REDIS_CLIENT'],
      useFactory: (redisClient) => {
        return new RedisStore({ client: redisClient });
      },
    },
  ],
  exports: ['REDIS_CLIENT', 'REDIS_STORE'],
})
export class RedisModule {}
