import { RoleType } from '@contracts/enums/role.enum';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.nativeEnum(RoleType).optional(),
  status: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
