-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('BELUM_DIBAYAR', 'SUDAH_DIBAYAR');

-- CreateTable
CREATE TABLE "transaksi" (
    "id" TEXT NOT NULL,
    "kodeBilling" TEXT NOT NULL,
    "pembeliId" TEXT NOT NULL,
    "totalHarga" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'BELUM_DIBAYAR',
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keranjang" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "keranjang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaksi_kodeBilling_key" ON "transaksi"("kodeBilling");

-- AddForeignKey
ALTER TABLE "keranjang" ADD CONSTRAINT "keranjang_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaksi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
