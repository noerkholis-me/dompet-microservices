import { Product, CreateProductPayload, ApiResponse } from '@/types';
import { mockProducts } from './mockData';

// Local state to simulate database
let products = [...mockProducts];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    await delay(500);
    return {
      success: true,
      data: products,
    };
  },

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    await delay(300);
    const product = products.find((p) => p.id === id);
    
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    return {
      success: true,
      data: product,
    };
  },

  async createProduct(payload: CreateProductPayload): Promise<ApiResponse<Product>> {
    await delay(600);

    const newProduct: Product = {
      id: String(Date.now()),
      namaProduk: payload.namaProduk,
      hargaPerToken: payload.hargaPerToken,
      jumlahHit: payload.jumlahHit,
      createdAt: new Date().toISOString().split('T')[0],
    };

    products.push(newProduct);

    return {
      success: true,
      data: newProduct,
      message: 'Produk berhasil ditambahkan',
    };
  },

  async updateProduct(id: string, payload: Partial<CreateProductPayload>): Promise<ApiResponse<Product>> {
    await delay(600);

    const index = products.findIndex((p) => p.id === id);
    
    if (index === -1) {
      throw new Error('Produk tidak ditemukan');
    }

    const updatedProduct: Product = {
      ...products[index],
      ...payload,
    };

    products[index] = updatedProduct;

    return {
      success: true,
      data: updatedProduct,
      message: 'Produk berhasil diperbarui',
    };
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    await delay(400);

    const index = products.findIndex((p) => p.id === id);
    
    if (index === -1) {
      throw new Error('Produk tidak ditemukan');
    }

    products.splice(index, 1);

    return {
      success: true,
      data: null,
      message: 'Produk berhasil dihapus',
    };
  },
};
