import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ example: 'uuid-user-123', description: 'ID pembeli (dari JWT)' })
  @IsString()
  pembeliId: string;
}
