import api from '@/lib/api';
import { CreateUserDto, UpdateUserDto } from '@contracts/dto/users';
import { User } from '@contracts/generated';
import { ApiResponse } from '@contracts/responses/api-response.interface';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  },

  // async getUsers(): Promise<ApiResponse<User[]>> {
  //   await delay(500);
  //   return {
  //     success: true,
  //     data: users,
  //   };
  // },

  // async getUserById(id: string): Promise<ApiResponse<User>> {
  //   await delay(300);
  //   const user = users.find((u) => u.id === id);

  //   if (!user) {
  //     throw new Error('User tidak ditemukan');
  //   }

  //   return {
  //     success: true,
  //     data: user,
  //   };
  // },

  // async createUser(payload: CreateUserPayload): Promise<ApiResponse<User>> {
  //   await delay(600);

  //   // Check if username already exists
  //   if (users.some((u) => u.username === payload.username)) {
  //     throw new Error('Username sudah digunakan');
  //   }

  //   // Check if email already exists
  //   if (users.some((u) => u.email === payload.email)) {
  //     throw new Error('Email sudah digunakan');
  //   }

  //   const newUser: User = {
  //     id: String(Date.now()),
  //     namaLengkap: payload.namaLengkap,
  //     username: payload.username,
  //     email: payload.email,
  //     role: payload.role,
  //     status: payload.status,
  //     createdAt: new Date().toISOString().split('T')[0],
  //   };

  //   users.push(newUser);

  //   return {
  //     success: true,
  //     data: newUser,
  //     message: 'User berhasil ditambahkan',
  //   };
  // },

  // async updateUser(payload: UpdateUserPayload): Promise<ApiResponse<User>> {
  //   await delay(600);

  //   const index = users.findIndex((u) => u.id === payload.id);

  //   if (index === -1) {
  //     throw new Error('User tidak ditemukan');
  //   }

  //   // Check username uniqueness (excluding current user)
  //   if (payload.username && users.some((u) => u.username === payload.username && u.id !== payload.id)) {
  //     throw new Error('Username sudah digunakan');
  //   }

  //   // Check email uniqueness (excluding current user)
  //   if (payload.email && users.some((u) => u.email === payload.email && u.id !== payload.id)) {
  //     throw new Error('Email sudah digunakan');
  //   }

  //   const updatedUser: User = {
  //     ...users[index],
  //     ...payload,
  //   };

  //   users[index] = updatedUser;

  //   return {
  //     success: true,
  //     data: updatedUser,
  //     message: 'User berhasil diperbarui',
  //   };
  // },

  // async deleteUser(id: string): Promise<ApiResponse<null>> {
  //   await delay(400);

  //   const index = users.findIndex((u) => u.id === id);

  //   if (index === -1) {
  //     throw new Error('User tidak ditemukan');
  //   }

  //   users.splice(index, 1);

  //   return {
  //     success: true,
  //     data: null,
  //     message: 'User berhasil dihapus',
  //   };
  // },

  // async searchUsers(query: string): Promise<ApiResponse<User[]>> {
  //   await delay(300);

  //   const filteredUsers = users.filter(
  //     (u) =>
  //       u.namaLengkap.toLowerCase().includes(query.toLowerCase()) ||
  //       u.username.toLowerCase().includes(query.toLowerCase()) ||
  //       u.email.toLowerCase().includes(query.toLowerCase()),
  //   );

  //   return {
  //     success: true,
  //     data: filteredUsers,
  //   };
  // },
};
