import { Transaction, CartItem } from '../generated/transaction-services.types';
import { Product } from '../generated/data-master-services.types';

export interface CartItemDetail extends CartItem {
  product?: Product;
}

export interface CartResponse {
  items: CartItemDetail[];
  total: number;
}

export interface CheckoutResponse {
  kodeBilling: string;
  totalHarga: number;
  expiredAt: Date;
  message: string;
}

export type TransactionHistoryResponse = Transaction & {
  items?: CartItemDetail[];
};
