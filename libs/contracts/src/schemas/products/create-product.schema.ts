import { z } from 'zod';

export const CreateProductSchema = z.object({
  harga: z.number(),
  name: z.string(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
