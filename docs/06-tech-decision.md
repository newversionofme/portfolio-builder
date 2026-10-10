# 06. Rekomendasi Arsitektur & Keputusan Teknologi (Tech Decisions)

Dokumen ini memvalidasi pilihan tumpukan teknologi (*tech stack*) yang diajukan, memberikan analisis perbandingan mendalam, serta melengkapi spesifikasi pustaka pendukung untuk memastikan platform berkinerja tinggi, aman, dan mudah diskalakan.

---

## 1. Ringkasan Tech Stack Inti (Approved Stack)

| Layer | Teknologi Terpilih | Justifikasi Utama |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router) + TypeScript** | React Server Components (RSC) untuk rendering publik super cepat (SSR/ISR), Server Actions untuk mutasi data form tanpa boiler-plate API routes, TypeScript untuk *end-to-end type safety*. |
| **Styling & UI** | **Tailwind CSS + shadcn/ui** | Desain fleksibel berbasis utilitas, komponen shadcn/ui dapat dikustomisasi langsung di codebase lokal (Radix Primitives), performa bundle CSS minimal. |
| **Database & ORM** | **PostgreSQL + Prisma ORM** | Relasi data portofolio kompleks (1:N untuk projects, experiences, educations, skills) tertangani secara konsisten dan terstruktur dengan migrasi aman & tipe data otomatis. |
| **Autentikasi** | **Auth.js (NextAuth v5)** | Standar industri untuk Next.js App Router, mendukung Credentials (email/password) dan OAuth (Google/GitHub) dengan sesi JWT/Database fleksibel. |
| **Form Management** | **React Hook Form + Zod** | Pengelolaan form multi-step kompleks dengan re-render minimal dan validasi skema deklaratif yang dapat dipakai bersama di frontend dan server. |

---

## 2. Pustaka Pendukung & Ekosistem Tambahan

Untuk mendukung kebutuhan fungsional seperti live preview real-time, upload gambar, dan navigasi interaktif, berikut adalah pustaka pelengkap yang direkomendasikan:

1. **State Management (Live Preview): `Zustand`**
   - *Alasan:* Sangat ringan (1kb), ideal untuk sinkronisasi state antara form editor di sisi kiri dan live preview iframe/komponen di sisi kanan secara instan tanpa re-render berlebihan.

2. **Ikonografi: `Lucide React`**
   - *Alasan:* Koleksi ikon modern yang konsisten, tree-shakeable, dan sudah terintegrasi sempurna dengan komponen shadcn/ui.

3. **Notifikasi & Feedback: `Sonner`**
   - *Alasan:* Toast notification library paling halus, modern, dan didukung penuh oleh shadcn/ui untuk feedback autosave dan notifikasi status.

4. **Penyimpanan Media & Gambar (Avatar & Galeri Proyek):**
   - *Opsi 1 (Cloud Native):* **Uploadthing** atau **Cloudinary / Supabase Storage** (upload langsung dari klien dengan signed URL, CDN terdistribusi).
   - *Opsi 2 (Self-hosted / Local Dev):* API route upload ke folder `/public/uploads` dengan konversi WebP.

5. **Animasi & Transisi: `Framer Motion`**
   - *Alasan:* Memberikan transisi halus saat berganti tab form, beralih antar 4 template secara instan, dan micro-interaction pada tombol *publish*.

6. **SEO & Open Graph Generation: `@vercel/og` / Next.js Image Response**
   - *Alasan:* Menghasilkan kartu preview Open Graph (OG Image) dinamis untuk setiap user (`/u/[slug]/opengraph-image`) secara otomatis dari nama dan headline pengguna.

---

## 3. Arsitektur Rendering & Optimasi Performa

```
                   ┌────────────────────────────────────────┐
                   │               USER REQUEST             │
                   └───────────────────┬────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
     [ Rute Publik /u/:slug ]                      [ Rute Dashboard /dashboard ]
                │                                             │
    ┌───────────┴───────────┐                     ┌───────────┴───────────┐
    │ Next.js Server        │                     │ Next.js Client +      │
    │ Component (RSC)       │                     │ Server Actions        │
    │ + ISR / Cache Tags    │                     │ (Auth.js Protected)   │
    └───────────┬───────────┘                     └───────────┬───────────┘
                ▼                                             ▼
    [ Caching di Edge / CDN ]                     [ Form State + Zustand ]
    (LCP < 1.0s, TTFB < 200ms)                    (Live Instant Preview)
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       ▼
                        [ Prisma Client (Connection Pool) ]
                                       ▼
                            [ PostgreSQL Database ]
```

### Strategi Caching:
- Halaman publik `/u/[slug]` dirender menggunakan **Server Components** dengan tag cache `portfolio-[slug]`.
- Saat pengguna menekan tombol **"Publish"** atau menyimpan data baru di editor, server memicu:
  ```typescript
  revalidateTag(`portfolio-${slug}`);
  ```
- Ini menjamin pengunjung publik selalu mendapatkan halaman HTML ter-cache super cepat (Lighthouse 100), sementara pemilik portofolio melihat update seketika setelah mempublikasikan perubahan.
