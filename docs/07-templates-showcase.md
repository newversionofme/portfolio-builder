# 07 - Showcase & Spesifikasi Template Portofolio

Dokumentasi rancangan visual, struktur layout, tipografi, dan interaktivitas untuk 4 template bawaan Portfolio Builder.

---

## 1. Template 1: Minimalist (Editorial & Whitespace Focused)
- **Karakter:** Elegan, bersih, tipografi modern, proporsi ruang putih lapang.
- **Cocok Untuk:** Desainer, konsultan, penulis, generalis.
- **Tipografi:** Sans-serif (`Inter` / `Plus Jakarta Sans`).
- **Skema Warna:** Light Mode / Dark Mode dengan aksen warna dinamis.

---

## 2. Template 2: Developer / Dark (Terminal & Code Aesthetics)
- **Karakter:** Cyber dark theme (`#0a0c10`), aksen syntax highlight & neon, tipografi monospaced untuk judul/tag (`JetBrains Mono`) dan sans-serif (`Inter`) untuk teks panjang (bio, deskripsi).
- **Aksesibilitas & Kontras (WCAG AA):**
  - Kontras teks terhadap latar gelap >= 4.5:1 (`text-zinc-200` dan `text-zinc-300`).
  - Animasi live pulse/glow dibungkus dalam `motion-safe:animate-ping` (otomatis nonaktif pada `prefers-reduced-motion`).
- **Responsivitas 375px Mobile & Isolasi Iframe:**
  - Teruji lebar viewport 375px dengan scroll width tepat 375px (tanpa overflow atau horizontal scrollbar).
  - Preview di editor dirender di dalam `<iframe>` viewport terisolasi (`/preview`), sehingga breakpoint Tailwind (`sm:`, `md:`, `lg:`) membaca dimensi frame simulasi secara akurat (bukan viewport browser host).
  - Sinkronisasi real-time Zustand ke iframe via `postMessage` dengan validasi `event.origin`.
  - Pada mobile 375px, avatar otomatis ditumpuk di atas nama (`flex-col md:flex-row-reverse`), nama menggunakan `break-words` tanpa terpecah per huruf, dan badge "Available" tidak menabrak kontrol jendela terminal.
- **Dukungan State Kosong (Empty State):** Jika bagian proyek/sertifikat/testimoni tidak diisi, template merender terminal profile & skills secara bersih tanpa frame kosong.
- **Kondisional Interaktif:**
  - Status *"Available for hire"* dikontrol penuh oleh toggle editor (`profile.availableForHire`).
  - Tombol email (`contact_me()` / `mailto:`) dan WhatsApp (`whatsapp://`) hanya tampil jika nomor/email diisi.

---

## 3. Template 3: Bold / Creative (Bento Grid & Visual Showcase)
- **Karakter:** Asymmetric Bento Grid layout modern (`rounded-3xl`), aksen glow ambient radial dinamis yang membaca `--accent-theme`, tipografi berbobot tebal dan ekspresif (`font-black`), kartu proyek visual-first beranimasi halus.
- **Target Pengguna:** UI/UX Designer, Creative Director, Art Director, Product Designer, Creative Freelancer, Ilustrator.
- **Komponen & Tata Letak Bento:**
  - **Hero Bento Box:** Tipografi nama masif (`text-4xl sm:text-7xl lg:text-8xl`), avatar squircle berbingkai tebal dengan sticker aksen *Verified*, tombol aksi kontak (*Get in Touch*, *WhatsApp*, *Resume*), dan grup ikon sosial media.
  - **About & Arsenal Bento:** Bio filosofis naratif dengan highlight pills dan kotak keahlian kreatif (*Creative Arsenal*) yang dikelompokkan per kategori dengan level kemahiran.
  - **Selected Work / Visual Showcase:** Kartu showcase proyek gambar-pertama (*mockup cover first*) dengan zoom hover berdurasi 500ms, pill tags, judul, narasi dampak, tombol *Live Preview* dan tautan *Source Code* via `SocialIcon`.
  - **Career Track & Credentials:** Timeline pengalaman kepemimpinan dan kartu kredensial pendidikan serta sertifikasi dengan link verifikasi.
  - **Social Proof & CTA:** Kutipan testimoni kolaborator dan banner penutup tebal *"Have a visionary project in mind? Let's collaborate"*.
- **Aksesibilitas & Kontras (WCAG AA):**
  - Kontras teks memenuhi standar tinggi terhadap latar belakang gelap `#09090b` (`text-zinc-100`, `text-zinc-200`, `text-zinc-300`).
  - Efek hover scale dan ping indicator dibungkus dalam `motion-safe:...` sehingga nonaktif saat `prefers-reduced-motion`.
  - Teks naratif panjang menggunakan font sans-serif (`font-sans`) dengan `leading-relaxed` untuk kemudahan membaca.
- **Responsivitas 375px Mobile & Anti-Overflow:**
  - Layout bento otomatis runtuh menjadi satu kolom rapi pada mobile (`grid-cols-1 md:grid-cols-12`).
  - Menggunakan `break-words` dan pembungkus aman sehingga tidak ada teks yang terpecah per huruf atau menimbulkan scroll horizontal.
- **Dukungan State Kosong (Empty State):** Seluruh kartu bento bersifat kondisional. Jika data proyek, pengalaman, sertifikat, atau testimoni kosong, bagian tersebut tidak dirender sama sekali (tanpa frame kosong).

---

## 4. Template 4: Elegant / Professional (Editorial & Executive Dossier)
- **Karakter:** Layout editorial dua kolom klasik & prestige (`#FDFCF7` warm ivory / slate stone), tipografi heading & body dinamis (`--font-heading` & `--font-body`), garis pemisah halus (*hairline rules*), dan aksen penomoran romawi (*I., II., III., IV.*).
- **Target Pengguna:** Profesional, Dosen/Akademisi, Peneliti, Konsultan Strategis, Eksekutif, Pengacara, Dokter/Spesialis.
- **Komponen & Tata Letak Editorial:**
  - **Editorial Masthead & Header:** Nama dalam heading berbobot (`text-3xl sm:text-6xl font-[family-name:var(--font-heading)]`), subtitle deskriptif miring (*italic*), badge ketersediaan konsultasi dinamis, lokasi, serta tombol download dossier/CV PDF dan inisiasi korespondensi (*Inquire*).
  - **Kotak Ringkasan "Sekilas / At a Glance":** Menampilkan peran terkini (memprioritaskan pekerjaan yang sedang berjalan / tanggal mulai terbaru), riwayat pendidikan terakhir, kompetensi inti teratas, serta domisili dan badge ketersediaan. Seluruh baris bersifat kondisional dan linier tanpa menyisakan petak kosong di grid.
  - **Tentang & Profil (I):** Narasi biografi dengan tata letak paragraf editorial lapang dan daftar sorotan keahlian (*Selected Highlights & Key Insights*).
  - **Portofolio & Karya (II):** Format artikel jurnal/kajian profesional dengan nomor katalog, status *Featured*, tagline, ringkasan dampak, tautan *View Project*, dan badge tags monospaced.
  - **Pengalaman Profesional (III):** Dossier timeline formal dengan titik penanda waktu, periode jabatan, perusahaan, lokasi, dan deskripsi tanggung jawab.
  - **Pendidikan (Sidebar):** Ditampilkan sangat menonjol di sidebar dengan gelar formal, institusi, tahun kelulusan, dan nilai kehormatan/IPK.
  - **Sertifikasi & Lisensi (Sidebar):** Kredensial terverifikasi dengan penerbit resmi, tanggal penerbitan, nomor ID lisensi, serta tombol verifikasi langsung (`ExternalLink`).
  - **Keahlian & Kompetensi (Sidebar):** Keahlian yang dikelompokkan berdasarkan kategori kompetensi dengan tingkat keahlian (*proficiency level*).
  - **Kontak & Kolaborasi:** Kartu korespondensi resmi dengan email (lengkap dengan fitur copy & inisiasi email), WhatsApp, telepon, dan tombol aksi pengiriman pesan formal.
- **Dukungan Multibahasa (i18n):**
  - Menggunakan kamus label terpusat (`src/lib/i18n/dictionary.ts`) yang mendukung Bahasa Indonesia dan Bahasa Inggris secara penuh tanpa hardcoded string di template.
- **Aksesibilitas & Kontras (WCAG AA):**
  - Kontras teks sangat tinggi (`text-stone-950` dan `text-stone-800` pada latar belakang warm cream `#FDFCF7` menghasilkan rasio kontras > 12:1, jauh melampaui standar WCAG AA 4.5:1).
  - Animasi live pulse indicator dibungkus `motion-safe:animate-pulse` dan `motion-reduce:animate-none`.
  - Teks panjang dan deskripsi menggunakan body font (`--font-body`) agar nyaman dibaca.
- **Responsivitas 375px Mobile & Anti-Overflow:**
  - Layout 2 kolom otomatis runtuh rapi menjadi 1 kolom linier pada layar mobile (`flex-col lg:flex-row`).
  - Proteksi `break-words` dan `overflow-x-hidden` di seluruh container untuk memastikan nol scroll horizontal pada 375px.
- **Dukungan State Kosong (Empty State):**
  - Setiap section bersifat kondisional.
  - Jika seluruh data sidebar kosong (tanpa pendidikan, sertifikasi, keahlian), konten utama otomatis melebar memenuhi layar tanpa menyisakan kolom kosong.
