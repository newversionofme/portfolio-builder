# 🚀 Panduan Deployment: Portfolio Builder (Vercel + Neon + Vercel Blob)

Dokumen ini adalah panduan lengkap langkah demi langkah untuk mendeploy aplikasi **Portfolio Builder** ke platform **Vercel** menggunakan database serverless **Neon PostgreSQL** dan media storage **Vercel Blob**.

---

## 📖 Kamus Istilah untuk Pemula

Sebelum memulai, berikut arti istilah teknis yang sering ditemui dalam deployment:

- **Deployment**: Proses memindahkan aplikasi dari komputer lokal ke server internet agar dapat diakses oleh siapa saja di seluruh dunia.
- **Vercel**: Platform hosting cloud modern yang mengotomatisasi proses build, hosting, dan scaling untuk aplikasi web Next.js.
- **GitHub**: Tempat menyimpan dan mengelola riwayat kode program (repository) secara online.
- **Neon PostgreSQL**: Layanan database PostgreSQL berbasis cloud (serverless) yang otomatis menyesuaikan kapasitas sesuai kebutuhan.
- **Connection String**: Satu baris teks berisi format alamat, username, password, dan nama database yang digunakan aplikasi untuk terhubung ke database.
- **Connection Pooling (`DATABASE_URL`)**: Mekanisme pembagian koneksi database secara efisien agar ribuan request serverless tidak membebani kapasitas database.
- **Direct URL (`DIRECT_URL`)**: Alamat koneksi langsung tanpa perantara pooler, wajib digunakan oleh Prisma saat menjalankan migrasi struktur tabel.
- **Environment Variable (Env Var)**: Variabel konfigurasi rahasia (seperti password database atau kunci enkripsi) yang disimpan terpisah dari kode program demi keamanan.
- **AUTH_SECRET**: Kunci enkripsi rahasia acak 32+ karakter yang digunakan Auth.js untuk mengamankan session login dan token JWT pengguna.
- **Vercel Blob Storage**: Layanan penyimpanan file (seperti foto profil avatar atau thumbnail proyek) di cloud Vercel dengan URL publik yang cepat dan aman.
- **Database Migration (`prisma migrate` / `prisma db push`)**: Perintah untuk menyinkronkan rancangan skema tabel (schema.prisma) ke dalam database nyata.

---

## 📋 Ringkasan Environment Variables (Env Vars)

Berikut adalah daftar variabel lingkungan yang harus dimasukkan ke halaman **Project Settings > Environment Variables** di dashboard Vercel:

| Nama Variabel | Wajib / Opsional | Contoh / Deskripsi | Sumber Nilai |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Wajib** | `postgres://user:pass@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require` | Didapat dari Dashboard Neon (Pilih tab **Pooled**) |
| `DIRECT_URL` | **Wajib** | `postgres://user:pass@ep-xyz.region.neon.tech/neondb?sslmode=require` | Didapat dari Dashboard Neon (Pilih tab **Direct / Unpooled**) |
| `AUTH_SECRET` | **Wajib** | String acak 32+ karakter (contoh: hasil `openssl rand -base64 32`) | Dibuat sendiri (bebas & rahasia) |
| `NEXTAUTH_URL` | Opsional | `https://portfolio-builder-anda.vercel.app` | Domain otomatis Vercel setelah deploy |
| `BLOB_READ_WRITE_TOKEN` | **Otomatis** | `vercel_blob_rw_...` | Dibuat otomatis saat menghubungkan tab **Storage > Blob** di Vercel |
| `STORAGE_PROVIDER` | Opsional | `blob` | Menentukan penyimpan file (`blob` untuk Vercel Blob) |
| `UPLOAD_MAX_FILE_SIZE_MB` | Opsional | `2` | Batas maksimum ukuran file unggahan dalam Megabyte (default: 2) |

---

## 🗺️ Langkah-langkah Deployment Terstruktur

### Langkah 1: Push Kode ke GitHub Repository
1. Buat repository baru di [GitHub](https://github.com/new) (bisa Public atau Private).
2. Pastikan file `.env` **tidak pernah di-commit** (sudah masuk di `.gitignore`).
3. Commit dan push kode project ke repository GitHub tersebut:
   ```bash
   git add .
   git commit -m "feat: prepare production configuration for Vercel, Neon, and Blob"
   git branch -M main
   git remote add origin https://github.com/username/portfolio-builder.git
   git push -u origin main
   ```

### Langkah 2: Buat Database di Neon
1. Masuk / Daftar akun gratis di [Neon Console](https://console.neon.tech/).
2. Buat Project baru (misal diberi nama `portfolio-builder-db`).
3. Pilih region terdekat (misalnya `ap-southeast-1` / Singapore).
4. Pada dashboard project Neon, salin Connection String:
   - Pilih tab **Pooled connection** -> Salin URL untuk `DATABASE_URL`.
   - Pilih tab **Direct connection** (tanpa pooler) -> Salin URL untuk `DIRECT_URL`.

### Langkah 3: Terapkan Skema Database (Inisialisasi Tabel)
Jalankan migrasi skema dari komputer lokal Anda ke database Neon:
```bash
DIRECT_URL="postgres://..." DATABASE_URL="postgres://..." npx prisma db push
```
*Catatan: Jangan jalankan seed di database production.*

### Langkah 4: Hubungkan Project ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New... > Project**.
2. Pilih repository GitHub `portfolio-builder` yang sudah dibuat pada Langkah 1.
3. Pada halaman konfigurasi project:
   - **Framework Preset**: Pilih `Next.js`.
   - **Build and Output Settings**: Biarkan default (`npm run build`).

### Langkah 5: Buat Vercel Blob Storage
1. Pada menu navigasi atas Vercel Dashboard, buka menu **Storage**.
2. Klik **Create Database** lalu pilih **Blob**.
3. Beri nama storage (misalnya `portfolio-assets`) dan klik **Create**.
4. Hubungkan (*Connect Store*) Blob tersebut ke Project `portfolio-builder` yang baru di-import.
   *(Vercel akan otomatis menyuntikkan `BLOB_READ_WRITE_TOKEN` ke environment variable project).*

### Langkah 6: Masukkan Environment Variables di Vercel
Buka project Anda di Vercel -> **Settings** -> **Environment Variables**, lalu tambahkan:
- `DATABASE_URL`: (Connection String Pooled dari Neon)
- `DIRECT_URL`: (Connection String Direct dari Neon)
- `AUTH_SECRET`: (String acak 32 karakter)
- `STORAGE_PROVIDER`: `blob`

### Langkah 7: Deploy & Verifikasi
1. Klik tombol **Deploy** di Vercel.
2. Tunggu proses build selesai hingga muncul konfirmasi dan screenshot halaman live.
3. Kunjungi URL yang diberikan (misal: `https://portfolio-builder-xyz.vercel.app`):
   - Buka `/register` dan buat akun pengguna baru.
   - Masuk ke `/dashboard` dan buka editor portofolio.
   - Coba unggah foto profil (memverifikasi Vercel Blob).
   - Simpan portofolio dan buka tautan publik `/u/[slug]` di tab incognito untuk memverifikasi database Neon.

---

## 🛡️ Checklist Keamanan Production

- [x] File `.env` masuk ke `.gitignore` dan tidak ada kredensial yang ter-commit.
- [x] `prisma/seed.ts` memiliki proteksi pemblokiran jika dijalankan di mode `NODE_ENV=production`.
- [x] Tombol "Quick Fill Demo Account" pada form login hanya aktif di mode `development`.
- [x] Auth.js dikonfigurasi dengan `trustHost: true` dan session berbasis JWT terenkripsi `AUTH_SECRET`.
- [x] Validasi MIME type dan batasan ukuran berkas (2 MB) tetap aktif sebelum upload ke Vercel Blob.
