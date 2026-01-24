<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Dompet Microservices

Proyek ini adalah implementasi sistem e-wallet berbasis microservices menggunakan **NestJS** untuk backend dan **React** untuk frontend. Sistem ini mendemonstrasikan arsitektur microservices dengan komunikasi HTTP/REST, manajemen database terpisah, dan penggunaan Docker untuk orkestrasi layanan.

## Arsitektur Layanan

Proyek ini terdiri dari beberapa layanan independen:

| Layanan                 | Deskripsi                                           | Port (Lokal) |
| :---------------------- | :-------------------------------------------------- | :----------- |
| **API Gateway**         | Pintu masuk utama (routing, throttling, auth check) | 3000         |
| **Auth Service**        | Manajemen user, registrasi, login, dan token (JWT)  | 3001         |
| **RBAC Service**        | Role Based Access Control (Manajemen hak akses)     | 3002         |
| **Data Master Service** | Pengelolaan data referensi (Bank, Kategori, dll)    | 3003         |
| **Transaction Service** | Pengelolaan transaksi e-wallet                      | 3004         |
| **Frontend**            | Antarmuka pengguna berbasis React + Vite            | 5174         |

## Stack Teknologi

- **Backend:** [NestJS v10.4.15](https://nestjs.com/)
- **Frontend:** [React v19.2.0](https://react.dev/) + [Vite v7.2.4](https://vitejs.dev/) + [TailwindCSS](https://tailwindcss.com/)
- **Database:** [PostgreSQL v15](https://www.postgresql.org/) (Multi-database)
- **ORM:** [Prisma v7.2.0](https://www.prisma.io/)
- **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Lainnya:** Redis (untuk caching/queue - opsional), BullMQ, Passport JWT, Argon2.

## Persiapan & Instalasi

### Prasyarat

- [Node.js](https://nodejs.org/) (versi LTS)
- [Docker](https://www.docker.com/get-started) & Docker Compose
- NPM (bawaan Node.js)

### Langkah-langkah Menjalankan Proyek

1. **Clone repositori:**

   ```bash
   git clone https://github.com/noerkholis-me/dompet-microservices
   ```

   ```bash
   cd dompet-microservices
   ```

2. **Setup Environment:**
   Salin file `.env.example` ke `.env` dan sesuaikan konfigurasinya. Jika belum ada, pastikan konfigurasi database di `docker-compose.yml` sudah sesuai.

3. **Jalankan menggunakan Docker Compose:**
   Ini akan membangun (build) semua service dan menjalankan container database serta backend/frontend.

   ```bash
   docker-compose up -d --build
   ```

4. **Migrasi Database (Setelah container berjalan):**
   Gunakan perintah berikut untuk menjalankan migrasi Prisma di semua service:
   ```bash
   npm run prisma:generate:all
   npm run prisma:migrate:all
   npm run prisma:seed:all
   ```

## Script Package Manager

Tersedia beberapa script di root `package.json` untuk mempermudah pengembangan:

- `npm run start:dev:<service-name>`: Menjalankan service spesifik dalam mode watch.
- `npm run build`: Membangun semua service backend.
- `npm run prisma:<service>:<action>`: Menjalankan perintah Prisma (generate, migrate, studio, seed) untuk service tertentu.
- `npm run format`: Menjalankan Prettier untuk memformat kode.
- `npm run lint`: Menjalankan ESLint untuk mengecek kualitas kode.

## Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan pengujian teknis.
