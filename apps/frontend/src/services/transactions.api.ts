import api from '@/lib/api';
import type { Cart, Transaction, AddToCartDto, CheckoutDto } from '../types';
import type { ApiResponse } from '@contracts/responses/api-response.interface';

export const transactionsApi = {
  addToCart: async (data: AddToCartDto): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/cart/add', data);
    return response.data;
  },

  getCart: async (userId: string): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>(`/cart/${userId}`);
    return response.data.data;
  },

  checkout: async (data: CheckoutDto): Promise<Transaction> => {
    const response = await api.post<ApiResponse<Transaction>>('/checkout', data);
    return response.data.data;
  },

  getTransactions: async (userId: string): Promise<Transaction[]> => {
    const response = await api.get<ApiResponse<Transaction[]>>(`/transactions/${userId}`);
    return response.data.data;
  },

  payTransaction: async (transactionId: string): Promise<Transaction> => {
    const response = await api.put<ApiResponse<Transaction>>(`/transactions/${transactionId}/pay`);
    return response.data.data;
  },
};
