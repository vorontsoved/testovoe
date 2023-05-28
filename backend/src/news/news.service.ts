import { Injectable } from '@nestjs/common';
import { NewsDto, UpdateNewsDto } from './dto/news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from 'src/database/entities/news.entity';
import { FindOneOptions, FindOperator, FindOperatorType, Repository } from 'typeorm';
import { ApiError } from 'src/exceptions/api-error';
import { Users } from 'src/database/entities/user.entity';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News)
        private newsRepository: Repository<News>,

    ) { }


    async createNews(news: NewsDto): Promise<Record<string, any>> {
        console.log(news)
        const newNews = new News()
        newNews.header = news.header
        newNews.body = news.body
        newNews.ownerId = news.user.id



        const createdNews = await this.newsRepository.save(newNews)

        return createdNews

    }

    async updateNews(news: UpdateNewsDto): Promise<Record<string, any>> {
        const newNews = new News()
        newNews.header = news.header
        newNews.body = news.body
        newNews.update_date = new Date()

        const createdNews = await this.newsRepository.update(news.idNews, newNews)

        return createdNews

    }

    async deleteNews(news: UpdateNewsDto): Promise<Record<string, any>> {
    
        const deleteNews = await this.newsRepository.delete(news.idNews)

        return deleteNews

    }

    async readNews(): Promise<Record<string, any>> {
        const allNews = await this.newsRepository.find()
        return allNews
    }

}
