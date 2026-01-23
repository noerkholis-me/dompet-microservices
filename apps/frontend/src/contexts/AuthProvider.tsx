import { useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/api';
import { AuthContext } from './AuthContext';
import type { AuthUser } from '../types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const authUser = await authApi.getMe();
          setUser(authUser);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { accessToken, refreshToken } = res;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);

    try {
      const authUser = await authApi.getMe();
      setUser(authUser);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const isAdmin = user?.roles?.includes('ADMIN') ?? false;
  const isPembeli = user?.roles?.includes('PEMBELI') ?? false;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAdmin, isPembeli }}>
      {children}
    </AuthContext.Provider>
  );
};
