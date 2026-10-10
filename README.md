# Portfolio Builder

A modern, full-featured portfolio builder platform built with **Next.js 15 (App Router)**, **Tailwind CSS**, **PostgreSQL**, **Prisma ORM**, and **NextAuth.js (Auth.js v5)**.

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat (Prerequisites)
> [!IMPORTANT]
> **Docker harus aktif dan berjalan** sebelum Anda menjalankan `npm run dev` agar aplikasi dapat terhubung ke database PostgreSQL lokal.

Pastikan Anda telah menginstal:
- **Node.js**: v18.18+ atau v20+
- **Docker & Docker Compose** (misal Docker Desktop)

---

### 2. Setup Database PostgreSQL Lokal
Jalankan container PostgreSQL lokal dengan named volume (`pgdata`) untuk persistensi data:

```bash
# 1. Jalankan PostgreSQL di background via Docker Compose
npm run db:up

# 2. Sinkronkan skema Prisma ke database
npm run db:push

# 3. Masukkan data awal demo (Alex Rivera & Maya Lin)
npm run db:seed
```

> [!TIP]
> Script `npm run db:up` menjalankan `docker compose up -d` dengan konfigurasi `restart: unless-stopped` dan volume bernama `pgdata` sehingga data Anda tetap aman dan persisten bahkan saat laptop restart.
> 
> **Peringatan:** Jangan jalankan `docker compose down -v` karena opsi `-v` akan menghapus volume data persisten.

---

### 3. Menjalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

---

## 📂 Struktur Script Tersedia

| Script | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server pada port 3000 |
| `npm run db:up` | Menjalankan container PostgreSQL di Docker background (`docker compose up -d`) |
| `npm run db:push` | Mendorong perubahan skema Prisma ke database PostgreSQL |
| `npm run db:seed` | Mengisi database dengan data contoh portofolio & akun demo |
| `npm run db:generate` | Membuat Prisma Client TypeScript types |
| `npm run build` | Melakukan compile dan build produksi |
| `npm run lint` | Menjalankan ESLint untuk pemeriksaan kualitas kode |

---

## 🎨 Template Portofolio Bawaan
1. **Minimalist:** Editorial, bersih, proporsi ruang putih lapang.
2. **Developer / Dark:** Cyber dark aesthetics, monospace command prompts, git logs & tech stack.
3. **Bold / Creative:** Asymmetric Bento Grid, visual-first project showcases, bold typography.
4. **Elegant / Professional:** Editorial serif prestige, executive dual-column layout.
