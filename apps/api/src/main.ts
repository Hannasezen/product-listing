/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

try {
  process.loadEnvFile(join(__dirname, '../.env'));
} catch {
  // No .env file (e.g. production, where env vars are injected by the platform).
}

async function bootstrap() {
  // Dynamic import: AppModule (via @org/db) reads process.env.DATABASE_URL at
  // import time, so it must load after loadEnvFile above, not before it.
  const { AppModule } = await import('./app/app.module.js');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, { exclude: ['health'] });
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
