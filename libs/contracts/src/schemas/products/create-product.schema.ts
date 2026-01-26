import { z } from 'zod';

export const CreateProductSchema = z.object({
  harga: z.number(),
  nama: z.string(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
