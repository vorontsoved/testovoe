import { IsNumber, IsString } from 'class-validator';

export class ItemsDTO {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  quantity: number;
}
