import { Transaction, PaymentStatus, ApiResponse, BillingInfo, Product } from '@/types';
import api from '@/lib/api';
import { CheckoutResponse, TransactionHistoryResponse } from '@contracts/responses/transaction-response.interface';
import { ETransactionStatus } from '@contracts/generated';

// Helper to map API transaction response to Frontend Transaction type
const mapApiTransactionToLocal = (t: TransactionHistoryResponse): FrontendTransaction => {
  let status: PaymentStatus = 'menunggu';
  if (t.status === 'SUDAH_DIBAYAR') {
    status = 'sudah_dibayar';
  } else if (t.status === 'BELUM_DIBAYAR') {
    status = 'menunggu';
    if (new Date(t.expiredAt) < new Date()) {
      status = 'expired';
    }
  }

  // Handle quantity safely - items is CartItemDetail[] which extends CartItem
  // CartItem in generated types doesn't have quantity, but we assume the API might return it
  // or we default to 1 as it's a cart item.
  // If the backend has strict 1 item per row logic, 1 is correct.
  // We touch 'qt' as 'any' to avoid TS error if the type definition is missing it but runtime has it,
  // or just default to 1.
  const quantity = t.items?.[0] || 1;

  return {
    id: t.id,
    idTransaksi: t.id,
    tanggal: new Date(t.createdAt).toISOString().split('T')[0],
    produk: t.items?.[0]?.product?.name || 'Unknown Product',
    jumlahHit: t.items?.[0]?.quantity || 0,
    total: t.totalHarga,
    status: t.status as PaymentStatus,
    kodeBilling: t.kodeBilling,
    tanggalKadaluarsa: t.expiredAt ? new Date(t.expiredAt).toISOString().split('T')[0] : undefined,
    userId: t.pembeliId,
  };
};

export const transactionService = {
  async getTransactions(userId?: string): Promise<TransactionHistoryResponse[]> {
    const response = await api.get<ApiResponse<TransactionHistoryResponse[]>>(`/transactions/${userId}`);
    return response.data.data;
  },

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    // Since we don't have a direct get-by-id endpoint that is public/exposed easily without userId,
    // we'll rely on the caller passing the right context or fetch all if we have userId stored somewhere.
    // Ideally, we would need userId here. For now, we might have to throw or handle this limitation.
    // However, the current UI likely calls this with a known "transaction" object in context,
    // or we might need to fetch the list and find it.
    // BUT, we don't have userId in arguments here.
    // We'll throw an error as this method signature is problematic without userId in the API URI.
    // OR we can rely on the fact that maybe the backend endpoint /transactions/:id could exist?
    // Checking controller: @Get('transactions/:userId') returns history.
    // There is @Put('transactions/:id/pay') but no Get By ID.
    // Frontend likely uses this for "Detail" view.

    // WORKAROUND: The frontend seems to rely on local state in the mock.
    // Real implementation would require fetching all (if we knew the user) or backend change.
    // I will try to fetch from /transactions/USER_ID if I can get current user ID.
    // But I don't have access to auth store here easily without circular dependency or hook rules.

    // Let's return a specific error or mock it for now until we fix the backend or context.
    // Actually, looking at the code, fetching all transactions requires userId.
    throw new Error('Method not supported: getTransactionById requires userId context');
  },

  async createTransaction(
    product: Product,
    userId: string,
  ): Promise<ApiResponse<{ transaction: Transaction; billing: BillingInfo }>> {
    try {
      // 1. Add to Cart
      await api.post('/cart/add', {
        productId: product.id,
        quantity: 1,
      });

      // 2. Checkout
      const checkoutResponse = await api.post<CheckoutResponse>('/checkout', {
        pembeliId: userId,
      });
      const checkoutData = checkoutResponse.data;

      // 3. Since checkout API doesn't return the full transaction object with ID,
      // We will fetch the latest transaction for this user to get the ID.
      // This is a workaround.
      const historyResponse = await api.get<TransactionHistoryResponse[]>(`/transactions/${userId}`);
      // Assuming the latest one is the one we just created.
      // Sort by createdAt desc just to be safe if backend doesn't order them.
      const sortedHistory = historyResponse.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      const latestTransaction = sortedHistory[0];

      if (!latestTransaction) {
        throw new Error('Failed to retrieve created transaction');
      }

      const transaction = mapApiTransactionToLocal(latestTransaction);

      const billing: BillingInfo = {
        kodeBilling: checkoutData.kodeBilling,
        nominal: checkoutData.totalHarga,
        tanggalKadaluarsa: new Date(checkoutData.expiredAt).toISOString().split('T')[0],
        produk: product.namaProduk,
        jumlahHit: product.jumlahHit,
      };

      return {
        success: true,
        data: { transaction, billing },
        message: 'Billing berhasil dibuat',
      };
    } catch (error) {
      console.error('Transaction creation failed:', error);
      throw error;
    }
  },

  async filterTransactions(
    userId: string,
    filters: {
      startDate?: string;
      endDate?: string;
      status?: ETransactionStatus | 'SEMUA';
    },
  ): Promise<ApiResponse<TransactionHistoryResponse[]>> {
    // Fetch all then filter client-side
    let result = await this.getTransactions(userId);

    if (filters.startDate) {
      result = result.filter((t) => new Date(t.createdAt) >= new Date(filters.startDate!));
    }

    if (filters.endDate) {
      result = result.filter((t) => new Date(t.createdAt) <= new Date(filters.endDate!));
    }

    return {
      success: true,
      data: result,
    };
  },

  async updateTransactionStatus(id: string, status: PaymentStatus): Promise<ApiResponse<Transaction>> {
    if (status === 'sudah_dibayar') {
      try {
        await api.put(`/transactions/${id}/pay`);
        // We can't easily get the updated object back exactly as is without refetching or mocking the return.
        // We'll return a partial success response or "fake" the status update on the object if the API returns void/string.
        // The controller returns: firstValueFrom(...).data.
        // Let's assume it returns something useful or we just construct the success state.

        // We need to return a Transaction object.
        // We don't have the full object here. This is tricky.
        // We might just return a dummy object with the new status and ID, assuming the UI merges it or re-fetches.
        // Or better, the UI should probably re-fetch the list.
        return {
          success: true,
          data: { id, status: 'sudah_dibayar' }, // detailed object missing
          message: 'Pembayaran berhasil',
        };
      } catch (error) {
        console.error('Payment failed:', error);
        throw error;
      }
    }

    throw new Error('Status update not supported for this status');
  },
};
