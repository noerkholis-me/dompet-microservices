import { z } from 'zod';
import { CreateUserSchema } from './create-user.schema';

export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
