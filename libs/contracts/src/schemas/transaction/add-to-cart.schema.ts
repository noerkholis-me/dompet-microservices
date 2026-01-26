import { z } from 'zod';

export const AddToCartSchema = z.object({
  productId: z.string().describe('ID produk dari data master'),
  quantity: z.number().min(1).describe('Jumlah item (minimal 1)'),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
