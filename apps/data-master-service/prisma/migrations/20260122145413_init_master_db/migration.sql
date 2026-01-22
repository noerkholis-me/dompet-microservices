-- CreateTable
CREATE TABLE "produk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "produk_name_key" ON "produk"("name");
