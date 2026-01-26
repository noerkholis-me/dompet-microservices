import { UserOmitPassword } from '@contracts/responses/auth-response.interface';

// User types
export type UserRole = 'admin' | 'pembeli';
export type UserStatus = 'aktif' | 'nonaktif';

export interface User {
  id: string;
  namaLengkap: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface CreateUserPayload {
  namaLengkap: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: string;
}

// Product types
export interface Product {
  id: string;
  namaProduk: string;
  hargaPerToken: number;
  jumlahHit: number;
  createdAt: string;
}

export interface CreateProductPayload {
  namaProduk: string;
  hargaPerToken: number;
  jumlahHit: number;
}

// Transaction types
export type PaymentStatus = 'menunggu' | 'sudah_dibayar' | 'expired';

export interface Transaction {
  id: string;
  idTransaksi: string;
  tanggal: string;
  produk: string;
  jumlahHit: number;
  total: number;
  status: PaymentStatus;
  kodeBilling?: string;
  tanggalKadaluarsa?: string;
  userId: string;
}

// Auth types
export interface AuthUser {
  id: string;
  username: string;
  namaLengkap: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: UserOmitPassword | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Billing types
export interface BillingInfo {
  kodeBilling: string;
  nominal: number;
  tanggalKadaluarsa: string;
  produk: string;
  jumlahHit: number;
}
