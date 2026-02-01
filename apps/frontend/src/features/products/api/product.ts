import { apiClient } from '@/lib/axios';
import { Product } from '@contracts/generated';
import { ApiResponse } from '@contracts/responses';

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>('/products');
  return response.data.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
};

export const createProduct = async (product: Product): Promise<Product> => {
  const response = await apiClient.post<ApiResponse<Product>>('/products', product);
  return response.data.data;
};

export const updateProduct = async (product: Product): Promise<Product> => {
  const response = await apiClient.put<ApiResponse<Product>>(`/products/${product.id}`, product);
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
  return response.data;
};
