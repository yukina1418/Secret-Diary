import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // 과부화 방지 라이브러리
  app.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 100 }));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
