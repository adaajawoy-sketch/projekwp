import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // 1. Perbesar batas upload (Supaya gambar tidak error saat upload)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // 2. IZINKAN SEMUA KONEKSI (CORS) - PENTING!
  app.enableCors({
    origin: '*', // Boleh diakses dari mana saja (Frontend)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Izinkan semua metode
    allowedHeaders: 'Content-Type, Accept',
  });

  // 3. Ganti Port ke 3005 (Solusi Bypass Port Stuck)
  // Kita pakai 3005 karena 3001 sepertinya macet di komputer kamu
  await app.listen(3001);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();