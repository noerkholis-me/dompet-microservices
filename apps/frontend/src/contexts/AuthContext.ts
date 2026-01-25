// src/contexts/AuthContext.ts - Context and types only (no components)
import { createContext } from 'react';
import type { LoginDto } from '@contracts/dto/auth/login.dto';
import type { UserResponse } from '@contracts/responses/auth-response.interface';

export interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
  isPembeli: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
