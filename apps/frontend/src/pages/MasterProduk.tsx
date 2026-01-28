import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product, CreateProductPayload } from '@/types';
import { productService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

const productSchema = z.object({
  namaProduk: z.string().min(1, 'Nama produk wajib diisi').max(100),
  hargaPerToken: z.number().min(1, 'Harga harus lebih dari 0'),
  jumlahHit: z.number().min(1, 'Jumlah hit harus lebih dari 0'),
});

type ProductFormData = z.infer<typeof productSchema>;

// Format currency helper
const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const MasterProduk: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

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

  const openCreateModal = () => {
    setSelectedProduct(null);
    reset({
      namaProduk: '',
      hargaPerToken: 0,
      jumlahHit: 100,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    reset({
      namaProduk: product.namaProduk,
      hargaPerToken: product.hargaPerToken,
      jumlahHit: product.jumlahHit,
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, data);
        toast({
          title: 'Berhasil',
          description: 'Produk berhasil diperbarui',
        });
      } else {
        await productService.createProduct(data as CreateProductPayload);
        toast({
          title: 'Berhasil',
          description: 'Produk berhasil ditambahkan',
        });
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await productService.deleteProduct(selectedProduct.id);
      toast({
        title: 'Berhasil',
        description: 'Produk berhasil dihapus',
      });
      setIsDeleteDialogOpen(false);
      fetchProducts();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daftar Produk API</h1>
          <p className="text-muted-foreground">Kelola produk API PNBP</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Jumlah Hit</TableHead>
                  <TableHead>Harga per Token/Hit</TableHead>
                  <TableHead>Total Harga</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Tidak ada data produk
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{product.namaProduk}</TableCell>
                      <TableCell>{product.jumlahHit.toLocaleString()} Hits</TableCell>
                      <TableCell>{formatRupiah(product.hargaPerToken)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatRupiah(product.hargaPerToken * product.jumlahHit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(product)}
                              aria-label={`Edit ${product.namaProduk}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Produk</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(product)}
                              aria-label={`Hapus ${product.namaProduk}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hapus Produk</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="namaProduk">Nama Produk</Label>
              <Input
                id="namaProduk"
                {...register('namaProduk')}
                className={errors.namaProduk ? 'border-destructive' : ''}
              />
              {errors.namaProduk && (
                <p className="text-sm text-destructive">{errors.namaProduk.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlahHit">Jumlah Hit</Label>
              <Input
                id="jumlahHit"
                type="number"
                {...register('jumlahHit', { valueAsNumber: true })}
                className={errors.jumlahHit ? 'border-destructive' : ''}
              />
              {errors.jumlahHit && (
                <p className="text-sm text-destructive">{errors.jumlahHit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hargaPerToken">Harga per Token/Hit (Rp)</Label>
              <Input
                id="hargaPerToken"
                type="number"
                {...register('hargaPerToken', { valueAsNumber: true })}
                className={errors.hargaPerToken ? 'border-destructive' : ''}
              />
              {errors.hargaPerToken && (
                <p className="text-sm text-destructive">{errors.hargaPerToken.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk "{selectedProduct?.namaProduk}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MasterProduk;
