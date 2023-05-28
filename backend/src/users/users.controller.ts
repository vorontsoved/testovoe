import { Body, Controller, Post, Res, UsePipes, Next, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiError } from 'src/exceptions/api-error';
import { ValidationPipe } from '@nestjs/common';
import { UserDto } from './dto/createUser.dto';
import { NextFunction, Response, Request  } from 'express';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Post('signUp')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() body: UserDto, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const user = body;
            const result = await this.userService.createUser(user)
            res.cookie('refresh_token', result.data.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            res.status(200).json({ message: 'Успешно зарегистрирован', userParams: result });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }


    @Post('signIn')
    async signIn(@Body() body: UserDto, @Res() res: Response, @Next() next: NextFunction) {
        try {
            console.log('signIn')
            const user = body;
            const result = await this.userService.signIn(user)
            res.cookie('refresh_token', result.data.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            res.status(200).json({ message: 'Успешная авторизация', userParams: result });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    @Post('signOut')
    async signOut(@Req() req: Request, @Body() body: UserDto, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { refresh_token } = req.cookies
            if (!refresh_token) {
                return next(ApiError.BadRequest('Токен не найден'))
              }
            const result = await this.userService.signOut(refresh_token)
            res.clearCookie('refresh_token')
            res.status(200).json({ message: 'Вы вышли', userParams: result });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Body() body: UserDto, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { refresh_token } = req.cookies
            const result = await this.userService.refresh(refresh_token)
            res.cookie('refresh_token', result.data.refresh_token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            res.status(200).json({ message: 'Обновили токен', userParams: result });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}
