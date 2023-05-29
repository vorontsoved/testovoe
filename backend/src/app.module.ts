import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { RequestHandler } from 'express';
import { NewsModule } from './news/news.module';
import { AuthMiddleware } from './middlewares/auth-middlewares';
import { NewsController } from './news/news.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: config.get<'postgres'>('TYPEORM_CONNECTION'),
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        port: config.get<number>('TYPEORM_PORT'),
        entities: ['./database/entities/**/*.{ts,js}'],
        synchronize: true,
        autoLoadEntities: true,
        logging: true
      }),
    }),
    UsersModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const cookieParserMiddleware: RequestHandler = cookieParser();
    consumer.apply(cookieParserMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware)
      .forRoutes(NewsController);
  }

}
