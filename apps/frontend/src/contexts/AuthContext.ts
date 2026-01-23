// src/contexts/AuthContext.ts - Context and types only (no components)
import { createContext } from 'react';
import type { AuthUser } from '../types';

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
  isPembeli: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
