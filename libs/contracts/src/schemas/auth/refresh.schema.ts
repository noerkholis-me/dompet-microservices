import { z } from 'zod';

export const RefreshSchema = z.object({
  refreshToken: z.string().describe('Refresh Token'),
});

export type RefreshInput = z.infer<typeof RefreshSchema>;
