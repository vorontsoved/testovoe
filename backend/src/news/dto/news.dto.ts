import { Users } from "src/database/entities/user.entity";
import { IsDefined, IsNumber } from 'class-validator';

export class NewsDto {
    @IsDefined()
    header: string;

    @IsDefined()
    body: string;

    user?: Users;
}

export class UpdateNewsDto {
    header: string;
    body: string;
    user?: Users;

    @IsDefined()
    @IsNumber()
    idNews: number
}

export class DeleteNewsDto {
    @IsDefined()
    @IsNumber()
    idNews: number
}

