import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email().describe('admin@dompet.com'),
  password: z.string().describe('admin123'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
