import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Transaction, PaymentStatus } from '@/types';
import { transactionService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, Loader2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransactionHistoryResponse } from '@contracts/responses/transaction-response.interface';
import { ETransactionStatus } from '@contracts/generated';

// Format currency helper
const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const statusConfig: Record<ETransactionStatus, { label: string; className: string }> = {
  BELUM_DIBAYAR: {
    label: 'Menunggu Pembayaran',
    className: 'bg-warning text-warning-foreground',
  },
  SUDAH_DIBAYAR: {
    label: 'Sudah Dibayar',
    className: 'bg-success text-success-foreground',
  },
};

const HistoryPembayaran: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<TransactionHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState<ETransactionStatus | 'SEMUA'>('SEMUA');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistoryResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await transactionService.filterTransactions(user.id, {
        startDate: startDate?.toISOString().split('T')[0],
        endDate: endDate?.toISOString().split('T')[0],
        status: statusFilter,
      });
      setTransactions(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data transaksi',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const handleFilter = () => {
    fetchTransactions();
  };

  const handleViewDetail = (transaction: TransactionHistoryResponse) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">History Pembayaran</h1>
        <p className="text-muted-foreground">Riwayat transaksi pembelian token API Anda</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Awal</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[200px] justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'dd MMMM yyyy', { locale: localeId }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Akhir</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-[200px] justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'dd MMMM yyyy', { locale: localeId }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status Pembayaran</label>
              <Select
                value={statusFilter}
                onValueChange={(value: ETransactionStatus | 'SEMUA') => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEMUA">Semua Status</SelectItem>
                  <SelectItem value="menunggu">Menunggu Pembayaran</SelectItem>
                  <SelectItem value="sudah_dibayar">Sudah Dibayar</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleFilter}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Table */}
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
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status Pembayaran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Tidak ada data transaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction, index) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>
                        {format(new Date(transaction.createdAt), 'dd MMM yyyy', { locale: localeId })}
                      </TableCell>
                      <TableCell>
                        <div>
                          {/* <p className="font-medium">{transaction}</p> */}
                          {/* <p className="text-xs text-muted-foreground">{transaction.product.price.toLocaleString()} Hits</p> */}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatRupiah(transaction.totalHarga)}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[transaction.status].className}>
                          {statusConfig[transaction.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(transaction)}>
                          <Eye className="mr-1 h-4 w-4" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">ID Transaksi</td>
                      <td className="px-4 py-3 font-mono font-bold">{selectedTransaction.id}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">Tanggal</td>
                      <td className="px-4 py-3 font-medium">
                        {format(new Date(selectedTransaction.createdAt), 'dd MMMM yyyy', { locale: localeId })}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">Produk</td>
                      <td className="px-4 py-3 font-medium">
                        {/* {selectedTransaction.items} ({selectedTransaction.items[0].jumlahHit.toLocaleString()} Hits) */}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">Total</td>
                      <td className="px-4 py-3 font-bold">{formatRupiah(selectedTransaction.totalHarga)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">Kode Billing</td>
                      <td className="px-4 py-3 font-mono font-bold text-primary">
                        {selectedTransaction.kodeBilling || '-'}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-muted-foreground">Kadaluarsa</td>
                      <td className="px-4 py-3 font-medium">
                        {selectedTransaction.expiredAt
                          ? format(new Date(selectedTransaction.expiredAt), 'dd MMMM yyyy', {
                              locale: localeId,
                            })
                          : '-'}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Status</td>
                      <td className="px-4 py-3">
                        <Badge className={statusConfig[selectedTransaction.status].className}>
                          {statusConfig[selectedTransaction.status].label}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {selectedTransaction.status === 'BELUM_DIBAYAR' && (
                <div className="rounded-lg bg-warning/10 p-4">
                  <p className="mb-2 text-sm font-medium text-warning">Cara Pembayaran:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Transfer melalui ATM/Mobile Banking BRI, BNI, Mandiri, atau BSI</li>
                    <li>• Pilih menu pembayaran PNBP/MPN</li>
                    <li>
                      • Masukkan kode billing:{' '}
                      <span className="font-mono font-bold">{selectedTransaction.kodeBilling}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryPembayaran;
