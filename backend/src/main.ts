import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthExceptionFilter } from './auth/jwtStrategy/jwt.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new JwtAuthExceptionFilter());
  await app.listen(5000);
}
bootstrap();
