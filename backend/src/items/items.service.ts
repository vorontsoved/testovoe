import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from 'src/database/entities/items.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Items) private itemsRepository: Repository<Items>,
  ) {}

  async addItem(item): Promise<Record<string, any>> {
    let isOk = true;
    const result = await this.itemsRepository.save(item).catch(error => {
      isOk = false;
      console.log(error);
    });

    if (isOk) {
      return { code: 201, content: result };
    } else {
      return { code: 400, content: { msg: 'Invalid request' } };
    }
  }

  async getItems(): Promise<Record<string, any>> {
    let isOk = true;
    const result = await this.itemsRepository.find().catch(error => {
      isOk = false;
      console.log(error);
    });

    if (isOk) {
      return { code: 200, content: result };
    } else {
      return { code: 400, content: { msg: 'Invalid request' } };
    }
  }
}
