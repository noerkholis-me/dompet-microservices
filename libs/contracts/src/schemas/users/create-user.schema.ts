import { RoleType } from '@contracts/enums/role.enum';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string(),
  password: z.string().min(6),
  role: z.nativeEnum(RoleType),
  status: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
