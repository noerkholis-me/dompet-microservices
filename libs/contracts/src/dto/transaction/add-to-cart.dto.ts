import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 'uuid-produk-123', description: 'ID produk dari data master' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 1, description: 'Jumlah item (minimal 1)' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
