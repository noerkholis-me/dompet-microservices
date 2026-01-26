import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { TransformInterceptor } from '@common/interceptors';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const logger = new Logger('ApiGatewayApplication');

  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalFilters(new AxiosExceptionFilter());
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://172.19.0.6:5173', 'http://localhost:8080'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-internal-key'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Dompet Microservices - Public API')
    .setDescription('Dompet Microservices - Public API Gateway')
    .addTag('Health')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document));

  const PORT = 3000;
  await app.listen(PORT, '0.0.0.0');

  logger.log(`🚀 Application is running on: http://localhost:${PORT}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${PORT}/api/docs`);
}

void bootstrap();
