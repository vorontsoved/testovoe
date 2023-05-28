import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { News } from 'src/database/entities/news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, News])],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService]
})
export class NewsModule { }
