import { AddToCartDto } from '@contracts/dto/transaction/add-to-cart.dto';
import { CheckoutDto } from '@contracts/dto/transaction/checkout.dto';
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CurrentUser, Roles } from '@common/decorators';
import { AuthenticatedUser } from '@contracts/interfaces';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { RoleType } from '@contracts/enums';

@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('cart/add')
  @Roles(RoleType.PEMBELI)
  async addToCart(@Body() dto: AddToCartDto, @CurrentUser() user: AuthenticatedUser) {
    console.log('test');
    return await this.transactionsService.addToCart(dto, user);
  }

  @Get('cart/:userId')
  async getCart(@Param('userId') userId: string) {
    return await this.transactionsService.getCartByUserId(userId);
  }

  @Post('checkout')
  async checkout(@Body() dto: CheckoutDto) {
    return await this.transactionsService.checkout(dto);
  }

  @Put('transactions/:id/pay')
  async pay(@Param('id') id: string) {
    return await this.transactionsService.paymentByTransactionId(id);
  }

  @Get('transactions/:userId')
  async getHistory(@Param('userId') userId: string) {
    return await this.transactionsService.getHistoryByUserId(userId);
  }
}
