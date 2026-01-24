import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { transactionsApi } from '@/services/api';
import { useAuth } from '@/contexts/useAuth';
import type { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TransactionsPage() {
  const { user, isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!user?.sub) return;
    try {
      setLoading(true);
      const data = await transactionsApi.getTransactions(user.sub);
      setTransactions(data);
      setError('');
    } catch (err) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 404) {
        setTransactions([]);
      } else {
        setError('Failed to load transactions');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.sub]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handlePay = async (transactionId: string) => {
    if (!confirm('Mark this transaction as paid?')) return;
    try {
      setPayingId(transactionId);
      await transactionsApi.payTransaction(transactionId);
      loadTransactions();
      alert('Transaction marked as paid!');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update transaction');
    } finally {
      setPayingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiredAt: string) => {
    return new Date(expiredAt) < new Date();
  };

  if (loading) {
    return (
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center py-8">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
                </div>
            )}

            {transactions.length === 0 ? (
                <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No transactions found</p>
                </div>
            ) : (
                <div className="space-y-4">
                {transactions.map((transaction) => (
                    <Card key={transaction.id} className="border shadow-none hover:shadow-md transition">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {transaction.kode_billing}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Created: {formatDate(transaction.created_at)}
                                </p>
                                {transaction.status === 'BELUM_DIBAYAR' && (
                                    <p className="text-sm text-orange-600">
                                    Expires: {formatDate(transaction.expired_at)}
                                    {isExpired(transaction.expired_at) && (
                                        <span className="ml-2 font-semibold">(EXPIRED)</span>
                                    )}
                                    </p>
                                )}
                                </div>
                                <div className="text-right">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    transaction.status === 'SUDAH_DIBAYAR'
                                        ? 'bg-green-100 text-green-800'
                                        : isExpired(transaction.expired_at)
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {transaction.status === 'SUDAH_DIBAYAR'
                                    ? 'PAID'
                                    : isExpired(transaction.expired_at)
                                        ? 'EXPIRED'
                                        : 'UNPAID'}
                                </span>
                                </div>
                            </div>

                            {transaction.keranjang && transaction.keranjang.length > 0 && (
                                <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                                <ul className="space-y-1">
                                    {transaction.keranjang.map((item) => (
                                    <li key={item.id} className="text-sm text-gray-600">
                                        {item.product?.name || `Product ${item.produk_id}`} x {item.quantity} ={' '}
                                        {formatCurrency(item.harga * item.quantity)}
                                    </li>
                                    ))}
                                </ul>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-xl font-bold text-gray-900">Total:</span>
                                <span className="text-2xl font-bold text-blue-600">
                                {formatCurrency(transaction.total_harga)}
                                </span>
                            </div>

                            {isAdmin && transaction.status === 'BELUM_DIBAYAR' && (
                                <div className="mt-4">
                                <Button
                                    onClick={() => handlePay(transaction.id)}
                                    disabled={payingId === transaction.id}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    {payingId === transaction.id ? 'Processing...' : 'Mark as Paid'}
                                </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
