// User types
export interface User {
  id: string;
  name: string;
  email: string;
  status: boolean;
  createdAt: string;
  role?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'PEMBELI';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'PEMBELI';
  status?: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  harga: number;
  created_at: string;
}

export interface CreateProductDto {
  nama: string;
  harga: number;
}

export interface UpdateProductDto {
  nama?: string;
  harga?: number;
}

// Cart types
export interface CartItem {
  id: string;
  transaksi_id?: string;
  produk_id: string;
  harga: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Transaction types
export interface Transaction {
  id: string;
  kode_billing: string;
  PEMBELI_id: string;
  total_harga: number;
  status: 'BELUM_DIBAYAR' | 'SUDAH_DIBAYAR';
  expired_at: string;
  created_at: string;
  keranjang?: CartItem[];
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface CheckoutDto {
  pembeliId: string;
}

// Auth types
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  sub: string;
  email: string;
  roles: ('ADMIN' | 'PEMBELI')[];
  iat?: number;
  exp?: number;
}
