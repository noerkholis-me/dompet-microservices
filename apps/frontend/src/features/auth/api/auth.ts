import { apiClient } from '@/lib/axios';
import { ApiResponse, UserOmitPassword } from '@contracts/responses';
import { AuthResponse } from '@contracts/responses';
import { LoginInput } from '@contracts/schemas/auth';

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/login', data);
  return response.data.data;
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/refresh-token', { refreshToken });
  return response.data.data;
};

export const getMe = async () => {
  const response = await apiClient.get<ApiResponse<UserOmitPassword>>('/me');
  return response.data.data;
};

export const logout = async () => {
  await apiClient.post<ApiResponse<void>>('/logout');
};
