import { z } from 'zod';
import { RoleType } from '../../enums/role.enum';

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
  role: z.nativeEnum(RoleType).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
