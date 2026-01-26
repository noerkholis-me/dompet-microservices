import { User, Product, Transaction } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    namaLengkap: 'John Doe',
    username: 'admin',
    email: 'admin@dompetpnbp.go.id',
    role: 'admin',
    status: 'aktif',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    namaLengkap: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@company.com',
    role: 'pembeli',
    status: 'aktif',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    namaLengkap: 'Ahmad Yusuf',
    username: 'ahmadyusuf',
    email: 'ahmad@company.com',
    role: 'pembeli',
    status: 'aktif',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    namaLengkap: 'Siti Nurhaliza',
    username: 'sitinur',
    email: 'siti@company.com',
    role: 'pembeli',
    status: 'nonaktif',
    createdAt: '2024-03-15',
  },
  {
    id: '5',
    namaLengkap: 'Budi Santoso',
    username: 'budisantoso',
    email: 'budi@company.com',
    role: 'admin',
    status: 'aktif',
    createdAt: '2024-04-01',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    namaProduk: 'API PNBP Basic',
    hargaPerToken: 15000,
    jumlahHit: 100,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    namaProduk: 'API PNBP Standard',
    hargaPerToken: 12500,
    jumlahHit: 500,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    namaProduk: 'API PNBP Premium',
    hargaPerToken: 10000,
    jumlahHit: 1000,
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    namaProduk: 'API PNBP Enterprise',
    hargaPerToken: 7500,
    jumlahHit: 5000,
    createdAt: '2024-01-01',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    idTransaksi: 'TRX-2024-001',
    tanggal: '2024-01-20',
    produk: 'API PNBP Basic',
    jumlahHit: 100,
    total: 1500000,
    status: 'sudah_dibayar',
    kodeBilling: 'SIM-65508052',
    tanggalKadaluarsa: '2024-01-21',
    userId: '2',
  },
  {
    id: '2',
    idTransaksi: 'TRX-2024-002',
    tanggal: '2024-02-15',
    produk: 'API PNBP Standard',
    jumlahHit: 500,
    total: 6250000,
    status: 'menunggu',
    kodeBilling: 'SIM-65508053',
    tanggalKadaluarsa: '2024-02-16',
    userId: '2',
  },
  {
    id: '3',
    idTransaksi: 'TRX-2024-003',
    tanggal: '2024-03-01',
    produk: 'API PNBP Premium',
    jumlahHit: 1000,
    total: 10000000,
    status: 'expired',
    kodeBilling: 'SIM-65508054',
    tanggalKadaluarsa: '2024-03-02',
    userId: '3',
  },
  {
    id: '4',
    idTransaksi: 'TRX-2024-004',
    tanggal: '2024-03-10',
    produk: 'API PNBP Enterprise',
    jumlahHit: 5000,
    total: 37500000,
    status: 'sudah_dibayar',
    kodeBilling: 'SIM-65508055',
    tanggalKadaluarsa: '2024-03-11',
    userId: '2',
  },
];

// Mock credentials for login
export const mockCredentials = [
  { username: 'admin', password: 'admin123', userId: '1' },
  { username: 'janesmith', password: 'jane123', userId: '2' },
  { username: 'ahmadyusuf', password: 'ahmad123', userId: '3' },
];
