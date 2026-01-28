import { createZodDto } from 'nestjs-zod';
import { AddToCartSchema } from '@contracts/schemas/transaction';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto extends createZodDto(AddToCartSchema) {
  @ApiProperty({ example: 'masukan product ID', description: 'Product ID' })
  productId: string;

  @ApiProperty({ example: 5, description: 'Quantity' })
  quantity: number;
}
