import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Dompet Auth Service')
    .setDescription('Dompet Auth Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const PORT = 3000;
  await app.listen(PORT, '0.0.0.0');

  logger.log(`🚀 Application is running on: http://localhost:${PORT}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${PORT}/api/docs`);
}

void bootstrap();
