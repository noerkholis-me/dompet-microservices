import { CommonService } from '@common/common.service';
import { AddToCartDto } from '@contracts/dto/transaction/add-to-cart.dto';
import { CheckoutDto } from '@contracts/dto/transaction/checkout.dto';
import { AuthenticatedUser } from '@contracts/interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionsService {
  private baseUrl: string;

  constructor(
    private commonService: CommonService,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('TRANSACTION_SERVICE_URL');
  }

  async addToCart(dto: AddToCartDto, user: AuthenticatedUser) {
    const data = await this.commonService.sendRequest({
      method: 'POST',
      url: `${this.baseUrl}/cart/add`,
      headers: this.commonService.getInternalHeaders(user),
      data: dto,
    });

    return data;
  }

  async getCartByUserId(userId: string) {
    const data = await this.commonService.sendRequest({
      method: 'GET',
      url: `${this.baseUrl}/cart/${userId}`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  async checkout(dto: CheckoutDto) {
    const data = await this.commonService.sendRequest({
      method: 'POST',
      url: `${this.baseUrl}/checkout`,
      headers: this.commonService.getInternalHeaders(),
      data: dto,
    });

    return data;
  }

  async paymentByTransactionId(transactionId: string) {
    const data = await this.commonService.sendRequest({
      method: 'POST',
      url: `${this.baseUrl}/transactions/${transactionId}/pay`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  async getHistoryByUserId(userId: string) {
    const data = await this.commonService.sendRequest({
      method: 'GET',
      url: `${this.baseUrl}/transactions/${userId}`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }
}
