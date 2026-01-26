import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().describe('uuid-transaksi-123'),
  kodeBilling: z.string().describe('INV-20260123-001'),
  pembeliId: z.string().describe('uuid-user-123'),
  totalHarga: z.number().describe('150000'),
  status: z.enum(['BELUM_DIBAYAR', 'SUDAH_DIBAYAR']).describe('BELUM_DIBAYAR'),
  expiredAt: z.date().describe('2026-01-24T03:22:00.000Z'),
  createdAt: z.date().describe('2026-01-23T03:22:00.000Z'),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;
