import api from '@/api';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  Product,
  CreateProductDto,
  UpdateProductDto,
  Cart,
  Transaction,
  AddToCartDto,
  CheckoutDto,
  LoginResponse,
  AuthUser,
} from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', { email, password });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/refresh-token', { refreshToken });
    return response.data;
  },

  getMe: async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>('/me');
    console.log(response);
    return response.data;
  },
};

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },
};

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  },
};

export const transactionsApi = {
  addToCart: async (data: AddToCartDto): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/cart/add', data);
    return response.data;
  },

  getCart: async (userId: string): Promise<Cart> => {
    const response = await api.get<Cart>(`/cart/${userId}`);
    return response.data;
  },

  checkout: async (data: CheckoutDto): Promise<Transaction> => {
    const response = await api.post<Transaction>('/checkout', data);
    return response.data;
  },

  getTransactions: async (userId: string): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(`/transactions/${userId}`);
    return response.data;
  },

  payTransaction: async (transactionId: string): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${transactionId}/pay`);
    return response.data;
  },
};
