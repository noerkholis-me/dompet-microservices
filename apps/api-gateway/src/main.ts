import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('ApiGatewayApplication');

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Dompet Microservices - Public API')
    .setDescription('Dompet Microservices - Public API Gateway')
    .addBearerAuth()
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
