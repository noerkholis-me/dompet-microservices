import { CommonService } from '@common/common.service';
import { CreateProductDto, UpdateProductDto } from '@contracts/dto/products';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private baseUrl: string;

  constructor(
    private configService: ConfigService,
    private commonService: CommonService,
  ) {
    this.baseUrl = this.configService.getOrThrow('DATA_MASTER_SERVICE_URL');
  }

  getProducts() {
    const data = this.commonService.sendRequest({
      method: 'GET',
      url: `${this.baseUrl}/products`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  getProductById(id: string) {
    const data = this.commonService.sendRequest({
      method: 'GET',
      url: `${this.baseUrl}/products/${id}`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  createProduct(dto: CreateProductDto) {
    const data = this.commonService.sendRequest({
      method: 'POST',
      url: `${this.baseUrl}/products`,
      data: dto,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  updateProduct(id: string, dto: UpdateProductDto) {
    const data = this.commonService.sendRequest({
      method: 'PUT',
      url: `${this.baseUrl}/products/${id}`,
      data: dto,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  deleteProduct(id: string) {
    const data = this.commonService.sendRequest({
      method: 'DELETE',
      url: `${this.baseUrl}/products/${id}`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }
}
