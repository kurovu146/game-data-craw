import { CacheModule, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ApolloDriver } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '@lib/prisma';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // NOTE: PROXY Careful to set up some more your app behind a PROXY,
    // https://docs.nestjs.com/security/rate-limiting#proxies
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          debug: configService.get('NODE_ENV') !== 'production',
          playground: configService.get('NODE_ENV') !== 'production',
          autoSchemaFile: process.cwd() + '/schema.gql',
          subscriptions: {
            'graphql-ws': true,
            'subscriptions-transport-ws': false,
          },
        };
      },
    }),
    CacheModule.register({ isGlobal: true, ttl: 5 * 60 }),
    ScheduleModule.forRoot(),
    PrismaModule,
    PlayerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}