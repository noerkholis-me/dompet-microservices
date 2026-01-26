import { z } from 'zod';

export const LogoutSchema = z.object({
  userId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LogoutInput = z.infer<typeof LogoutSchema>;
