import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AddToCartDto } from '@contracts/dto/transaction/add-to-cart.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { InternalGuard } from '@common/guards';

@Controller()
@UseGuards(InternalGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('cart/add')
  async addToCart(@Body() dto: AddToCartDto, @CurrentUser('sub') userId: string) {
    return this.transactionsService.addToCart(userId, dto);
  }

  @Get('cart/:pembeliId')
  async getCart(@Param('pembeliId') pembeliId: string) {
    return this.transactionsService.getCart(pembeliId);
  }

  @Post('checkout')
  async checkout(@CurrentUser('sub') userId: string) {
    return this.transactionsService.checkout(userId);
  }

  @Put('transactions/:id/pay')
  async pay(@Param('id') id: string) {
    return this.transactionsService.pay(id);
  }

  @Get('transactions/:pembeliId')
  async getHistory(@Param('pembeliId') pembeliId: string) {
    return this.transactionsService.getHistory(pembeliId);
  }
}
