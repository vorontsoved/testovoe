import { Body, Controller, Post, Res, Req, Get } from '@nestjs/common';
import { validate } from 'class-validator';
import { ItemsService } from './items.service';
import { ItemsDTO } from './dto/items.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Post()
  async createItem(@Body() body, @Res() res) {
    let isOk = false;
    const item = new ItemsDTO();
    item.description = body.description;
    item.name = body.name;
    item.quantity = body.quantity;

    await validate(item).then(errors => {
      if (errors.length > 0) {
        console.log(errors);
      } else {
        isOk = true;
      }
    });

    if (isOk) {
      const result = await this.itemService.addItem(item);
      res.status(result.code).json(result.content);
    } else {
      res.status(400).json({ msg: 'Invalid request' });
    }
  }

  @Get()
  async listItems(@Res() res) {
    const result = await this.itemService.getItems();
    res.status(result.code).json(result.content);
  }
}
