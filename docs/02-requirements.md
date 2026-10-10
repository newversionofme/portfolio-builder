# 02. Kebutuhan Sistem & Spesifikasi Produk (Requirements)

Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional, persona pengguna, *user stories*, serta matriks prioritas fitur MVP vs fitur masa depan menggunakan kerangka kerja **MoSCoW**.

---

## 1. Persona Pengguna

### Persona 1: Rian (Fresh Graduate / Mahasiswa Tingkat Akhir)
- **Karakter:** Menguasai bidangnya (Bisnis / Teknik / Komunikasi), namun tidak paham HTML/CSS/Web hosting.
- **Tujuan:** Membuat portofolio online cepat untuk dilampirkan pada lamaran kerja di LinkedIn & Glints.
- **Pain Point:** Bingung cara membuat website portofolio gratis yang terlihat profesional tanpa watermark mengganggu.

### Persona 2: Maya (Freelance UI/UX & Graphic Designer)
- **Karakter:** Sangat memperhatikan estetika visual, warna, dan kualitas tampilan gambar/mockup.
- **Tujuan:** Menampilkan studi kasus proyek (*problem*, *process*, *solution*, *visual mockup*).
- **Pain Point:** Webflow terlalu rumit dipelajari dan memakan waktu berhari-hari; Behance tidak terasa seperti website personal milik sendiri.

### Persona 3: David (Software Engineer / Full-Stack Developer)
- **Karakter:** Menyukai dark mode, kode bersih, tautan repositori GitHub, demo langsung, dan badge teknologi.
- **Tujuan:** Menampilkan proyek open-source, tech stack (React, Node, Go, Docker), dan link artikel teknis.
- **Pain Point:** Malas membangun website portofolio dari nol berulang kali; ingin sistem yang langsung rapi dan otomatis responsif.

---

## 2. Kebutuhan Fungsional (Functional Requirements)

### FR-01: Autentikasi & Akun Pengguna
- Registrasi dan login dengan Email/Password dan OAuth (Google / GitHub).
- Manajemen sesi aman dan proteksi rute dashboard (`/dashboard/*`).
- Pengaturan profil pengguna dan pengelolaan custom slug username (`/u/:slug` atau `/:username`).

### FR-02: Form Builder Data Portofolio Multi-Bagian
- **Header / Profil Utama:** Nama lengkap, headline/tagline profesi, avatar/foto profil, status ketersediaan kerja (*Available for Hire badge*), lokasi, bio singkat.
- **Tentang Saya (About):** Deskripsi naratif panjang (mendukung markdown/rich-text ringkas).
- **Pengalaman Kerja (Work Experience):** Posisi, nama perusahaan, link perusahaan, tipe pekerjaan (Full-time, Contract, Freelance), tanggal mulai/selesai, status saat ini (*Current*), deskripsi pencapaian (bullet points).
- **Pendidikan (Education):** Institusi/Universitas, gelar/jurusan, tahun mulai & lulus, deskripsi/prestasi.
- **Keahlian (Skills):** Kategori skill (Frontend, Backend, Design, Soft Skills, Tools), tingkat kemahiran (opsional), tag badges.
- **Proyek (Projects Showcase):** Judul proyek, thumbnail/galeri gambar, deskripsi/studi kasus, tag teknologi yang digunakan, live URL demo, link repository (GitHub), featured project toggle.
- **Sertifikasi & Lisensi (Certifications):** Nama sertifikat, organisasi penerbit, tanggal terbit & kedaluwarsa, credential ID / URL verifikasi.
- **Testimoni / Rekomendasi (Testimonials):** Nama pemberi testimoni, jabatan, perusahaan, kutipan testimoni, avatar.
- **Kontak & Media Sosial (Contact & Socials):** Email kontak, formulir kontak publik / mailto, tautan sosial media (GitHub, LinkedIn, Twitter/X, Dribbble, Instagram, YouTube, Website, WhatsApp).

### FR-03: Engine Template & Kustomisasi Visual
- Pemilihan 4 template bawaan:
  1. *Minimalist* (Editorial, clean, monokrom/subtle color, fokus tipografi).
  2. *Bold / Creative* (Vibrant, dynamic card accents, cocok untuk desainer & kreator).
  3. *Developer / Dark Mode* (Terminal-inspired, tech-badges, code snippets vibe).
  4. *Elegant / Professional* (Corporate prestige, refined serif & clean layout, cocok untuk konsultan/eksekutif/fresh grad).
- Kustomisasi aksen warna utama (Color picker & preset palet).
- Kustomisasi font (Pilihan kombinasi font sans & serif modern).
- Toggle aktif/non-aktifkan (*visibility toggle*) dan *re-order* urutan seksi portofolio.

### FR-04: Live Real-Time Preview
- Split screen atau panel preview instan di dashboard (desktop, tablet, mobile toggle).
- Update tampilan seketika saat data form diubah (*state synchronization*).

### FR-05: Publishing & Sharing
- 1-Click Publish ke URL publik publik yang bersih (`/u/[username]`).
- Pengaturan status visibilitas (Draft vs Published).
- Custom Meta Tags untuk Open Graph (OG Image preview di WhatsApp, Twitter, LinkedIn).
- Fitur copy link publik dan share ke sosial media.
- Tombol export / download CV versi PDF (dari data portofolio yang sama).

---

## 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **NFR-01 (Performa & Kecepatan):** Google Lighthouse Score > 90 untuk Performance, Accessibility, Best Practices, dan SEO pada halaman publik. Waktu muat halaman publik (LCP) < 1.5 detik.
- **NFR-02 (Responsivitas Mobile):** 100% responsif di semua ukuran layar (Mobile 360px+, Tablet 768px+, Desktop 1024px+, Wide Screen 1440px+).
- **NFR-03 (Keamanan Data):** Validasi schema ketat di sisi klien dan server (Zod). Sanitasi input untuk mencegah XSS & SQL Injection. Proteksi CSRF pada form & mutasi server.
- **NFR-04 (Skalabilitas & Arsitektur):** Server-Side Rendering (SSR) & Incremental Static Regeneration (ISR) / On-Demand Revalidation pada rute publik untuk caching instan dan beban database minimal.
- **NFR-05 (Aksesibilitas - a11y):** Sesuai standar WCAG 2.1 AA (kontras warna teks yang memadai, label ARIA pada kontrol interaktif, navigasi keyboard penuh).

---

## 4. Matriks Prioritas Fitur (MoSCoW Framework)

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│              MUST HAVE                │              SHOULD HAVE              │
│               (MVP)                   │             (Post-MVP v1.1)           │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ • Auth (Email/Password & Google)      │ • Analytics (Page views, link clicks) │
│ • Multi-step Form Builder Data Lengkap│ • PDF Resume Exporter (Print CSS)     │
│ • 4 Template Terkurasi & Responsif    │ • Dark / Light mode toggle publik     │
│ • Live Interactive Preview (Desktop/  │ • Custom Section Builder              │
│   Mobile toggle)                      │ • Drag-and-drop reordering seksi      │
│ • Instant Publishing via /u/:slug     │ • AI Assistant (Generate bio/summary) │
│ • Custom accent color & font selector │                                       │
│ • Open Graph SEO metadata otomatis    │                                       │
├───────────────────────────────────────┼───────────────────────────────────────┤
│              COULD HAVE               │              WON'T HAVE               │
│               (v1.2+)                 │             (Out of Scope)            │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ • Custom domain mapping (CNAME)       │ • Drag-and-drop freeform canvas       │
│ • Integrasi API GitHub Repo langsung  │   (seperti Photoshop/Framer)          │
│ • Import data langsung dari LinkedIn  │ • Marketplace jual-beli aset digital  │
│ • Formulir kontak pesan langsung ke   │ • Built-in payment gateway / billing  │
│   inbox/email (Resend/SendGrid)       │   e-commerce store                    │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 5. User Stories Inti (MVP)

1. **Sebagai fresh graduate**, saya ingin mengisi data diri dan pendidikan dengan form sederhana agar saya tidak pusing memikirkan cara mendesain website.
2. **Sebagai desainer**, saya ingin mengunggah tangkapan layar proyek dan memilih tema Bold agar portofolio saya menarik perhatian creative director.
3. **Sebagai developer**, saya ingin memilih tema Dark Mode dan menambahkan link GitHub serta tag bahasa pemrograman agar recruiter tech langsung paham kemampuan saya.
4. **Sebagai pencari kerja**, saya ingin melihat live preview secara langsung di samping form agar saya tahu persis bagaimana tampilan website saya sebelum dipublikasikan.
5. **Sebagai pengguna**, saya ingin membagikan tautan portofolio saya dengan satu klik agar dapat langsung saya cantumkan di CV atau profil LinkedIn.
