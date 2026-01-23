// src/contexts/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus di dalam AuthProvider');
  return context;
};
