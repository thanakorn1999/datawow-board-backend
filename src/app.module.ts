import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './common/config/app.config';
import databaseConfig from './common/config/database.config';
import jwtConfig from './common/config/jwt.config';
import { validate } from './common/validation/env.validation';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import redisConfig from './common/config/redis.config';
import { RedisModule } from './redis/redis.module';
import swaggerConfig from './common/config/swagger.config';
//
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { CommunitysModule } from './communities/communities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig, redisConfig, swaggerConfig],
      validate,
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
    BlogsModule,
    CommentsModule,
    CommunitysModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
