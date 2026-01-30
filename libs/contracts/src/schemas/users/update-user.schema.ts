import * as z from 'zod';
import { CreateUserSchema } from './create-user.schema';

export const UpdateUserSchema = CreateUserSchema.extend({ password: z.string().optional() });

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
