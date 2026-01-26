import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('ADMIN');

  const adminStats = [
    {
      title: 'Total Users',
      value: '5',
      change: '+12%',
      icon: Users,
      gradient: 'gradient-blue',
    },
    {
      title: 'Total Produk',
      value: '4',
      change: '+5%',
      icon: Package,
      gradient: 'gradient-orange',
    },
    {
      title: 'Total Transaksi',
      value: '24',
      change: '+18%',
      icon: ShoppingCart,
      gradient: 'gradient-purple',
    },
    {
      title: 'Pendapatan',
      value: 'Rp 55.250.000',
      change: '+22%',
      icon: TrendingUp,
      gradient: 'gradient-blue',
    },
  ];

  const pembeliStats = [
    {
      title: 'Total Pembelian',
      value: '8',
      change: '+2 bulan ini',
      icon: ShoppingCart,
      gradient: 'gradient-blue',
    },
    {
      title: 'Token Tersedia',
      value: '2,500',
      change: 'Hits',
      icon: Package,
      gradient: 'gradient-orange',
    },
    {
      title: 'Menunggu Bayar',
      value: '1',
      change: 'Transaksi',
      icon: TrendingUp,
      gradient: 'gradient-purple',
    },
  ];

  const stats = isAdmin ? adminStats : pembeliStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang, {user?.name}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`h-1 ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {isAdmin ? (
              <>
                <a
                  href="/users"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Kelola User</p>
                    <p className="text-sm text-muted-foreground">Tambah, edit, atau hapus user</p>
                  </div>
                </a>
                <a
                  href="/products"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <Package className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Master Produk</p>
                    <p className="text-sm text-muted-foreground">Kelola produk API</p>
                  </div>
                </a>
              </>
            ) : (
              <>
                <a
                  href="/purchase"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Beli Produk</p>
                    <p className="text-sm text-muted-foreground">Beli token API</p>
                  </div>
                </a>
                <a
                  href="/history"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">History Pembayaran</p>
                    <p className="text-sm text-muted-foreground">Lihat riwayat transaksi</p>
                  </div>
                </a>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
