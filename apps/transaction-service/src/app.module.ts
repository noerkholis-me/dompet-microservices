import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CartService } from './cart/cart.service';

@Module({
  imports: [PrismaModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService, CartService],
})
export class AppModule {}
