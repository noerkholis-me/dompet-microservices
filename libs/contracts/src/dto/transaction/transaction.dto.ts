import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ example: 'uuid-transaksi-123' })
  id: string;

  @ApiProperty({ example: 'INV-20260123-001' })
  kodeBilling: string;

  @ApiProperty({ example: 'uuid-user-123' })
  pembeliId: string;

  @ApiProperty({ example: 150000 })
  totalHarga: number;

  @ApiProperty({ enum: ['BELUM_DIBAYAR', 'SUDAH_DIBAYAR'], example: 'BELUM_DIBAYAR' })
  status: string;

  @ApiProperty({ example: '2026-01-24T03:22:00.000Z' })
  expiredAt: Date;

  @ApiProperty({ example: '2026-01-23T03:22:00.000Z' })
  createdAt: Date;
}
