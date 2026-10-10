# 05. Sistem Desain & Konsep 4 Template Portofolio

Dokumen ini menetapkan fondasi visual (*Design Tokens*), prinsip desain antarmuka, arsitektur komponen UI, serta spesifikasi mendalam untuk **4 Template Portofolio Bawaan**.

---

## 1. Prinsip Desain (Design Principles)

1. **Content First, Zero Clutter:** Portofolio adalah panggung bagi karya dan keahlian pengguna, bukan pameran efek visual yang mengalihkan perhatian rekruter.
2. **Instant Visual Hierarchy:** Informasi penting (Nama, Headline, Proyek Unggulan, Kontak) harus dapat dipahami dalam 5 detik pertama (*The 5-Second Recruiter Rule*).
3. **Flawless Responsiveness:** Setiap layout, grid kartu proyek, dan timeline pengalaman harus tertata presisi di layar ponsel (360px) hingga monitor ultrawide (1440px+).
4. **Adaptive Theming via Variables:** Perubahan warna aksen atau font diterapkan secara dinamis melalui CSS Variables (`--primary`, `--font-heading`, `--font-body`).

---

## 2. Token Desain (Design Tokens)

### Palet Warna Utama (App Platform UI)
- **Primary:** `#2563EB` (Royal Blue) / `#3B82F6` (Electric Blue)
- **Secondary:** `#475569` (Slate 600)
- **Background (Light):** `#FAFAFA` (Zinc 50)
- **Surface (Light):** `#FFFFFF`
- **Background (Dark):** `#09090B` (Zinc 950)
- **Surface (Dark):** `#18181B` (Zinc 900)
- **Borders:** `#E4E4E7` (Light) / `#27272A` (Dark)
- **Accent Palettes for Users:**
  - *Electric Blue:* `#2563EB`
  - *Emerald Green:* `#059669`
  - *Violet Purple:* `#7C3AED`
  - *Amber Orange:* `#D97706`
  - *Rose Pink:* `#E11D48`
  - *Monochrome / Slate:* `#18181B`

### Tipografi & Font Pairing
- **Sans-Serif (Modern / Tech):** `Inter`, `Geist Sans`, `Plus Jakarta Sans`
- **Serif (Editorial / Prestigious):** `Playfair Display`, `Lora`, `Instrument Serif`
- **Monospace (Code / Terminal):** `JetBrains Mono`, `Geist Mono`, `Fira Code`

### Skala Spacing & Radius
- **Spacing Scale:** Tailwind 4px unit (`p-2: 8px`, `p-4: 16px`, `p-6: 24px`, `p-8: 32px`, `p-12: 48px`, `p-16: 64px`).
- **Corner Radius:** `rounded-lg: 8px` (Default UI), `rounded-xl: 12px` (Cards), `rounded-2xl: 16px` (Bento/Hero cards), `rounded-full` (Badges & Avatars).

---

## 3. Komponen UI Inti (Core UI Components)

Platform menggunakan **shadcn/ui** berbasis Radix UI Primitives:
- **Navigation & Layout:** Navbar, Sidebar Dashboard, Breadcrumb, Tabs, Responsive Drawer.
- **Form Controls:** Input, Textarea, Select, Multi-select Badge Input, Switch, DatePicker, File/Image Dropzone dengan preview.
- **Feedback & Overlays:** Dialog/Modal, Alert Dialog, Sheet (Slide-over Preview on mobile), Toast notifications (Sonner), Tooltip.
- **Data Display:** Card, Badge, Avatar, Separator, Accordion, Progress Bar, Skeleton Loader.

---

## 4. Konsep Mendalam 4 Template Portofolio

```
┌─────────────────────────┬─────────────────────────┐
│     1. MINIMALIST       │     2. BOLD/CREATIVE    │
│  (Clean, Editorial,     │  (Vibrant, Asymmetric,  │
│   Whitespace-focused)   │   Card Grids, High-Pop) │
├─────────────────────────┼─────────────────────────┤
│    3. DEVELOPER/DARK    │  4. ELEGANT/PROFESSIONAL│
│  (Terminal vibe, Mono,  │  (Refined Serif, Classy,│
│   Tech badges, Repos)   │   Corporate & Academic) │
└─────────────────────────┴─────────────────────────┘
```

---

### Template 1: Minimalist (Clean & Editorial)
- **Karakter Visual:** Whitespace luas, monokromatik dengan 1 aksen warna halus, tipografi elegan (Sans-serif tipis dan rapi).
- **Target Pengguna:** Fresh graduate, penulis, manajer produk, arsitek, konsultan umum.
- **Fitur Layout:**
  - Single column centered layout (max-w-3xl) untuk kenyamanan membaca layaknya artikel majalah premium.
  - Timeline riwayat kerja bergaya garis tipis vertikal dengan dot halus.
  - Tag skill berukuran kecil dengan latar abu-abu terang (*subtle pill badges*).
  - Galeri proyek dengan layout vertikal bercerita (*narrative case-study style*).

---

### Template 2: Bold / Creative (Vibrant & Expressive)
- **Karakter Visual:** Card border tegas, warna aksen kontras, gradient background opsional, bento-grid layout modern.
- **Target Pengguna:** UI/UX designer, graphic designer, ilustrator, video editor, creative freelancer.
- **Fitur Layout:**
  - Hero section besar dengan avatar berbingkai artistik dan badge *"Available for Projects"*.
  - Bento-box grid 2x2 dan 1x2 untuk proyek unggulan dengan efek hover zoom & overlay aksi (*Live Demo / View Case*).
  - Visual skills tag berwarna-warni yang dikelompokkan berdasarkan kategori kreatif (Figma, Blender, After Effects).
  - Floating sticky contact button di pojok kanan bawah.

---

### Template 3: Developer / Dark Mode (Terminal & Code Inspired)
- **Karakter Visual:** Tema gelap pekat (*true dark `#0a0a0f`*), font monospaced untuk header dan tag, syntax-highlighted accents, card bergradasi border neon halus.
- **Target Pengguna:** Software engineer, backend dev, DevOps, data scientist, open-source contributor.
- **Fitur Layout:**
  - Hero section dengan status online bergaya terminal (`$ whoami: Senior Fullstack Engineer`).
  - Kartu proyek dilengkapi tombol langsung *"GitHub Repo"* (dengan icon bintang repo) dan *"Live URL"*.
  - Skills section dikelompokkan dengan ikon teknologi dan badge tech stack resmi.
  - Experience timeline bergaya Git commit log / pipeline tracker.

---

### Template 4: Elegant / Professional (Corporate Prestige)
- **Karakter Visual:** Perpaduan font Serif klasik (`Playfair Display` / `Lora`) pada judul dengan font Sans modern pada teks bodi; warna aksen bernuansa mewah (Deep Navy, Forest Green, atau Warm Gold).
- **Target Pengguna:** Eksekutif, akuntan, akademisi/peneliti, konsultan bisnis, profesional medis, fresh graduate hukum/ekonomi.
- **Fitur Layout:**
  - Header split 2 kolom: foto profil formal di sisi kanan dan ringkasan eksekutif + kontak di sisi kiri.
  - Seksi sertifikasi dan lisensi ditempatkan di posisi teratas dengan logo verifikasi resmi.
  - Seksi riwayat pendidikan lengkap dengan IPK (*GPA*) dan penghargaan akademik.
  - Kartu testimoni bergaya kutipan resmi dengan avatar dan jabatan pemberi rekomendasi.
