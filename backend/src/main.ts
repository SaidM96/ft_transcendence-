import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors();
  app.use(cookieParser());
  await app.listen(5000);
}
bootstrap();
