-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'PEMBELI');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_role" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RoleType" NOT NULL,

    CONSTRAINT "users_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_role_userId_role_key" ON "users_role"("userId", "role");

-- AddForeignKey
ALTER TABLE "users_role" ADD CONSTRAINT "users_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
