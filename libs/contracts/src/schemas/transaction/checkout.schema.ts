import { z } from 'zod';

export const CheckoutSchema = z.object({
  pembeliId: z.string().describe('ID pembeli (dari JWT)'),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
