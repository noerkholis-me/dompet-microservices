import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthState } from '@/types';
import { authService } from '@/services/api';
import { LoginInput } from '@contracts/schemas/auth';

interface AuthContextType extends AuthState {
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TOKEN_KEY = 'dompet_microservice_token';
export const USER_KEY = 'dompet_microservice_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        try {
          await authService.getMe();

          setState({
            user: JSON.parse(storedUser),
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (data: LoginInput) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authService.login(data);
      const { user, token } = response;

      console.log(token);

      localStorage.setItem(TOKEN_KEY, token.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setState({
        user,
        token: token.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
