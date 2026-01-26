import { z } from 'zod';
import { CreateProductSchema } from './create-product.schema';

export const UpdateProductSchema = CreateProductSchema.partial();

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
