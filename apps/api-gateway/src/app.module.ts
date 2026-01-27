import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      global: true,
    }),
    AuthModule,
    ProductsModule,
    TransactionsModule,
    UsersModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ZodValidationPipe(),
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ZodSerializerInterceptor(),
    },
    JwtService,
  ],
})
export class AppModule {}
