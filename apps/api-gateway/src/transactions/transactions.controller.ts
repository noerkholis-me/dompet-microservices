import { AddToCartDto } from '@contracts/dto/transaction/add-to-cart.dto';
import { CheckoutDto } from '@contracts/dto/transaction/checkout.dto';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, Post, Req, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Controller('api')
export class TransactionsController {
  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {}

  @Post('cart/add')
  async addToCart(@Body() dto: AddToCartDto, @Req() req: Request) {
    return (
      await firstValueFrom(
        this.http.post<string>('http://transaction-service:3000/cart/add', dto, {
          headers: {
            'X-INTERNAL-KEY': this.config.get<string>('INTERNAL_API_KEY'),
            Authorization: req.headers.authorization,
          },
        }),
      )
    ).data;
  }

  @Get('cart/:userId')
  async getCart(@Param('userId') userId: string, @Req() req: Request) {
    return (
      await firstValueFrom(
        this.http.get<string>(`http://transaction-service:3000/cart/${userId}`, {
          headers: {
            'X-INTERNAL-KEY': this.config.get<string>('INTERNAL_API_KEY'),
            Authorization: req.headers.authorization,
          },
        }),
      )
    ).data;
  }

  @Post('checkout')
  async checkout(@Body() dto: CheckoutDto, @Req() req: Request) {
    return (
      await firstValueFrom(
        this.http.post<string>('http://transaction-service:3000/checkout', dto, {
          headers: {
            'X-INTERNAL-KEY': this.config.get<string>('INTERNAL_API_KEY'),
            Authorization: req.headers.authorization,
          },
        }),
      )
    ).data;
  }

  @Put('transactions/:id/pay')
  async pay(@Param('id') id: string, @Req() req: Request) {
    return (
      await firstValueFrom(
        this.http.put<string>(`http://transaction-service:3000/transactions/${id}/pay`, {
          headers: {
            'X-INTERNAL-KEY': this.config.get<string>('INTERNAL_API_KEY'),
            Authorization: req.headers.authorization,
          },
        }),
      )
    ).data;
  }

  @Get('transactions/:userId')
  async getHistory(@Param('userId') userId: string, @Req() req: Request) {
    return (
      await firstValueFrom(
        this.http.get<string>(`http://transaction-service:3000/transactions/${userId}`, {
          headers: {
            'X-INTERNAL-KEY': this.config.get<string>('INTERNAL_API_KEY'),
            Authorization: req.headers.authorization,
          },
        }),
      )
    ).data;
  }
}
