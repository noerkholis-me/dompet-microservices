import { apiClient } from '@/lib/axios';
import { CreateUserDto, UpdateUserDto } from '@contracts/dto/users';
import { User } from '@contracts/generated';
import { ApiResponse } from '@contracts/responses';

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<ApiResponse<User[]>>('/users');
  return response.data.data;
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>('/users', data);
  return response.data.data;
};

export const updateUser = async (data: UpdateUserDto, id: string): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
  return response.data;
};
