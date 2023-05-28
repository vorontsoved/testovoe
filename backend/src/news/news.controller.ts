import { Body, Controller, Get, Next, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsDto, UpdateNewsDto } from './dto/news.dto';
import { NextFunction, Response, Request  } from 'express';

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @Post('createNews')
    @UsePipes(new ValidationPipe())
    async createNews(@Body() body: NewsDto, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const news = body;
            
            const result = await this.newsService.createNews(news)
   
            res.status(200).json({ message: 'Новость создана', userParams:result});
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    @Post('updateNews')
    @UsePipes(new ValidationPipe())
    async updateNews(@Body() body: UpdateNewsDto, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const news = body;
            
            const result = await this.newsService.updateNews(news)
   
            res.status(200).json({ message: 'Новость обновлена', userParams:result});
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    
    @Post('deleteNews')
    @UsePipes(new ValidationPipe())
    async deleteNews(@Body() body: UpdateNewsDto, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const news = body;
            
            const result = await this.newsService.deleteNews(news)
   
            res.status(200).json({ message: 'Новость удалена', userParams:result});
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    @Get('readNews')
    async readNews(@Res() res: Response, @Next() next: NextFunction) {
        try {
            const result = await this.newsService.readNews()
            res.status(200).json({ message: 'Все новости', userParams:result});
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}
