import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/user.entity';
import { Token } from 'src/database/entities/tokens.entity';

import { Repository, FindOneOptions } from 'typeorm';
import { UserDto } from './dto/createUser.dto';
import { ApiError } from 'src/exceptions/api-error';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    saltLength = 10
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
    ) { }
    static validateAccessToken(token: string): any {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET as jwt.Secret)
            return userData;
        } catch (error) {
            return null
        }
    }

    validateRefreshToken(token: string): any {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET as jwt.Secret)
            return userData;
        } catch (error) {
            return null
        }
    }

    generateToken = async (payload: { login: string, id: number }): Promise<any> => {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as jwt.Secret, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as jwt.Secret, { expiresIn: '3d' });
        return {
            accessToken,
            refreshToken,
        };
    };




    async saveToken(userId: number, refreshToken: string): Promise<void> {
        const tokenData = await this.tokenRepository.findOne({ where: { user_id: userId } } as FindOneOptions);
        if (tokenData) {
            const updatedToken = await this.tokenRepository.update(tokenData.id, {
                refresh_token: refreshToken,
            });
            if (!updatedToken) {
                throw ApiError.BadRequest('Ошибка авторизации, refresh_token не обновился');
            }
            return;
        }
        const token = new Token()
        token.refresh_token = refreshToken
        token.user_id = userId
        const newToken = await this.tokenRepository.save(token);

        return;
    }

    async createUser(user: UserDto): Promise<Record<string, any>> {
        const result = await this.userRepository.findOne({ where: { login: user.login } } as FindOneOptions);
        if (result !== null) {
            throw ApiError.BadRequest('Такой логин уже занят')
        }
        const salt: string = bcrypt.genSaltSync(this.saltLength)
        const hash: string = bcrypt.hashSync(user.password, salt)
        const newUser = new Users()
        newUser.login = user.login
        newUser.salt = salt
        newUser.password_hash = hash
        const createdUser = await this.userRepository.save(newUser);
        const tokens = await this.generateToken({ login: user.login, id: createdUser.id });
        await this.saveToken(createdUser.id, tokens.refreshToken)
        return {
            data: {
                'id': createdUser.id,
                'login': createdUser.login,
                'refresh_token': tokens.refreshToken,
                'access_token': tokens.accessToken
            }
        }
    }

    async signIn(user: UserDto): Promise<Record<string, any>> {
        const userBD = await this.userRepository.findOne({ where: { login: user.login } } as FindOneOptions);

        if (userBD === null) {
            throw ApiError.BadRequest('Вы не зарегестрированы')
        }


        const isPassEquals = await bcrypt.compare(user.password, userBD.password_hash)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Пароль неверный')
        }
        const tokens = await this.generateToken({ login: userBD.login, id: userBD.id });
        await this.saveToken(userBD.id, tokens.refreshToken)
        return {
            data: {
                'id': userBD.id,
                'login': userBD.login,
                'refresh_token': tokens.refreshToken,
                'access_token': tokens.accessToken
            }
        }
    }


    async signOut(refresh_token: string): Promise<Record<string, any>> {
        const token = await this.tokenRepository.findOne({ where: { refresh_token } });
        if (!token) {
            throw ApiError.BadRequest('Токен не найден')
        }

        const removedToken = await this.tokenRepository.remove(token);
        console.log(removedToken);
        return removedToken;
    }


    async refresh(refresh_token: string): Promise<Record<string, any>> {
        if (!refresh_token) {
            throw ApiError.UnauthorizedError()
        }
        const userData = this.validateRefreshToken(refresh_token);
        const tokenFromDb = await this.tokenRepository.findOne({ where: { refresh_token } });
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await this.userRepository.findOne({ where: { login: userData.login } })
        const tokens = await this.generateToken({ login: user.login, id: user.id });
        await this.saveToken(user.id, tokens.refreshToken)

        return {
            data: {
                'id': user.id,
                'login': user.login,
                'refresh_token': tokens.refreshToken,
                'access_token': tokens.accessToken
            }
        }
    }


}
