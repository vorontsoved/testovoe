import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ErrorFilter } from './filters/error.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ErrorFilter());
  const config = await app.get(ConfigService)
  const port = config.get<number>('API_PORT')

  await app.listen(port || 3001, () => {
    console.log(`[server]: Сервер запущен на http://localhost:${port}`)
  });

  
}

bootstrap();
