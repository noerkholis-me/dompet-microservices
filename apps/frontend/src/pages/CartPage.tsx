import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import type { Cart, CartItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { transactionsApi } from '@/services/transactions.api';

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const loadCart = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await transactionsApi.getCart(user.id);
      setCart(data);
      setError('');
    } catch (err) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 404) {
        setCart({ items: [], total: 0 });
      } else {
        setError('Failed to load cart');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleCheckout = async () => {
    if (!user?.id) {
      setError('User ID not found');
      return;
    }
    if (!cart || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }
    try {
      setCheckingOut(true);
      await transactionsApi.checkout({ pembeliId: user.id });
      alert('Checkout successful! Redirecting to transactions...');
      navigate('/transactions');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to checkout');
    } finally {
      setCheckingOut(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
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
            <CardTitle className="text-3xl font-bold">Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <Button onClick={() => navigate('/products')} size="lg">
                  Browse Products
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.product?.name || `Product ${item.produk_id}`}
                        </h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.harga * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">{formatCurrency(item.harga)} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(cart.total)}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  >
                    {checkingOut ? 'Processing...' : 'Checkout'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
