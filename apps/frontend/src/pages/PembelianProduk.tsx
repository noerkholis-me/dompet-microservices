import React, { useState, useEffect } from 'react';
import { Product, BillingInfo } from '@/types';
import { productService, transactionService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, Package } from 'lucide-react';

// Format currency helper
const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const gradients = ['gradient-blue', 'gradient-orange', 'gradient-purple'];

const PembelianProduk: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data produk',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCheckout = async () => {
    if (!selectedProduct || !user) return;

    try {
      setIsProcessing(true);
      const response = await transactionService.createTransaction(selectedProduct, user.id);
      setBillingInfo(response.data.billing);
      setIsCheckoutOpen(false);
      setIsBillingOpen(true);
      toast({
        title: 'Berhasil',
        description: 'Billing berhasil dibuat',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBillingClose = () => {
    setIsBillingOpen(false);
    setBillingInfo(null);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Beli Produk</h1>
        <p className="text-muted-foreground">Pilih paket token API yang sesuai kebutuhan Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <Card key={product.id} className="overflow-hidden transition-transform hover:scale-105">
            <div className={`${gradients[index % gradients.length]} p-6 text-primary-foreground`}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{product.namaProduk}</h3>
              <p className="text-sm opacity-90">{product.jumlahHit.toLocaleString()} Hits</p>
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Harga per Hit</p>
                <p className="text-lg font-semibold">{formatRupiah(product.hargaPerToken)}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">Total Harga</p>
                <p className="text-2xl font-bold text-primary">
                  {formatRupiah(product.hargaPerToken * product.jumlahHit)}
                </p>
              </div>
              <Button className="w-full" onClick={() => handleBuyClick(product)}>
                Beli Sekarang
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembelian</DialogTitle>
            <DialogDescription>Periksa detail pembelian Anda sebelum melanjutkan</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-semibold">{selectedProduct.namaProduk}</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah Token/Hit</span>
                    <span className="font-medium">{selectedProduct.jumlahHit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga per Hit</span>
                    <span className="font-medium">{formatRupiah(selectedProduct.hargaPerToken)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">
                        {formatRupiah(selectedProduct.hargaPerToken * selectedProduct.jumlahHit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCheckout} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Lanjutkan Pembayaran'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Billing Success Modal */}
      <Dialog open={isBillingOpen} onOpenChange={handleBillingClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-6 w-6" />
              Billing Berhasil Dibuat!
            </DialogTitle>
          </DialogHeader>

          {billingInfo && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">Kode Billing (SIMPONI)</td>
                      <td className="px-4 py-3 font-mono font-bold text-primary">{billingInfo.kodeBilling}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">Produk</td>
                      <td className="px-4 py-3 font-medium">
                        {billingInfo.produk} ({billingInfo.jumlahHit.toLocaleString()} Hits)
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">Nominal</td>
                      <td className="px-4 py-3 font-bold">{formatRupiah(billingInfo.nominal)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Tanggal Kadaluarsa</td>
                      <td className="px-4 py-3 font-medium text-destructive">
                        {new Date(billingInfo.tanggalKadaluarsa).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm font-medium">Cara Pembayaran:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Transfer melalui ATM/Mobile Banking BRI, BNI, Mandiri, atau BSI</li>
                  <li>• Pilih menu pembayaran PNBP/MPN</li>
                  <li>• Masukkan kode billing di atas</li>
                  <li>• Selesaikan pembayaran sebelum tanggal kadaluarsa</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleBillingClose} className="w-full">
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PembelianProduk;
