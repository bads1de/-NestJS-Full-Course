import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AuthFactoryService } from './lib/auth/auth-factory.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  const factory = app.get(AuthFactoryService);
  const auth = await factory.getAuth();
  const { toNodeHandler } = await import('better-auth/node');
  app.use('/api/auth/', toNodeHandler(auth));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
