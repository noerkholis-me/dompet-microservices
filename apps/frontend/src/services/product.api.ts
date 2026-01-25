import api from '@/lib/api';
import type { Product, CreateProductDto, UpdateProductDto } from '@/types';
import type { ApiResponse } from '@contracts/responses/api-response.interface';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/products/${id}`);
    return response.data;
  },
};
