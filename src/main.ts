import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GeneralException } from './exception/GeneralException';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GeneralException());
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(cookieParser());
  await app.listen(3003);
}
bootstrap();
