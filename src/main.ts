import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Configuration } from './auth/addon/configuration';
import { ApplicationModule } from './application/application.module';

async function run() {
  const api = await NestFactory.create<NestExpressApplication>(
    ApplicationModule,
    new ExpressAdapter()
  );

  api.setGlobalPrefix('api');

  api.enableCors({
    origin: Configuration.getClientLink() || 'http://localhost:3000',
    credentials: true
  });

  api.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true
  }));

  api.use(cookieParser(process.env.JWT_SECRET));

  SwaggerModule.setup('api', api, SwaggerModule.createDocument(api, new DocumentBuilder()
    .setTitle('API | Simple Nest Template')
    .build()
  ));

  api.listen(process.env.PORT || 3001, '0.0.0.0');
}

run();
