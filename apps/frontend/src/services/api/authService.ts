import api from '@/lib/api';
import { LoginDto } from '@contracts/dto/auth/login.dto';
import type { AuthResponse, UserOmitPassword } from '@contracts/responses/auth-response.interface';
import type { ApiResponse } from '@contracts/responses/api-response.interface';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/login', data);
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/refresh-token', { refreshToken });
    return response.data.data;
  },

  getMe: async () => {
    const response = await api.get<ApiResponse<UserOmitPassword>>('/me');
    return response.data.data;
  },

  logout: async () => {
    await api.post<ApiResponse<void>>('/logout');
  },
};
