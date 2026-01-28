import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CartService } from './cart/cart.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GatewaySecurityMiddleware } from '@common/middlewares';

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
    PrismaModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CartService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GatewaySecurityMiddleware).forRoutes('*');
  }
}
