import { IsEmail, Length } from 'class-validator';

export class UserDto {
  @IsEmail()
  login: string;

  @Length(3, 32)
  password: string;
}
