import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/useAuth';
import type { Product, CreateProductDto, UpdateProductDto } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { productsApi } from '@/services/product.api';
import { transactionsApi } from '@/services/transactions.api';

export default function ProductsPage() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductDto>({
    nama: '',
    harga: 0,
  });
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const updateData: UpdateProductDto = {
          nama: formData.nama,
          harga: formData.harga,
        };
        await productsApi.update(editingProduct.id, updateData);
      } else {
        await productsApi.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsApi.delete(id);
      loadProducts();
    } catch {
      setError('Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nama: product.name,
      harga: product.harga,
    });
    setShowModal(true);
  };

  const handleAddToCart = async (productId: string) => {
    if (!user?.id) {
      setError('User ID not found');
      return;
    }
    try {
      setAddingToCart(productId);
      await transactionsApi.addToCart({
        productId,
        quantity: 1,
      });
      alert('Product added to cart!');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      harga: 0,
    });
    setEditingProduct(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-3xl font-bold">Products</CardTitle>
            {isAdmin && (
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                Add Product
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="border shadow-sm hover:shadow-md transition">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(product.harga)}</p>
                    </CardContent>
                    <CardFooter>
                      {isAdmin ? (
                        <div className="flex space-x-2 w-full">
                          <Button onClick={() => handleEdit(product)} className="flex-1">
                            Edit
                          </Button>
                          <Button onClick={() => handleDelete(product.id)} variant="destructive" className="flex-1">
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingToCart === product.id}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
          />
          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            value={formData.harga}
            onChange={(e) => setFormData({ ...formData, harga: parseFloat(e.target.value) || 0 })}
            required
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{editingProduct ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
