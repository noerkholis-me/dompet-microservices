import { Product } from '../generated/data-master-services.types';

export type ProductResponse = Product;

export interface PaginatedProductResponse {
  items: Product[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
