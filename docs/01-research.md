# 01. Analisis Riset Kompetitor & Peluang Pasar

Dokumen ini memetakan lanskap produk pembuat portofolio digital (*portfolio builders*), menganalisis 7 platform sejenis terkemuka, serta mengidentifikasi celah pasar (*market gaps*) yang menjadi pembeda utama platform **Portfolio Builder**.

---

## 1. Lanskap Pasar & Kategori Platform

Pasar pembuat portofolio saat ini terbagi ke dalam 4 kuadran:

1. **Visual Website Builders (Webflow, Framer, Wix, Squarespace):** Fleksibilitas tinggi, namun *learning curve* sangat curam dan *time-to-publish* lama (> beberapa hari).
2. **Form / Document-driven Builders (Read.cv, Notion Sites):** Pengisian mudah berbasis data/dokumen, namun variasi visual dan fleksibilitas kustomisasi visual terbatas.
3. **Bento / Widget-based Builders (Bento.me, Bio.link, Linktree):** Cepat dan modern untuk *creator economy*, namun kurang ideal untuk struktur CV/resume formal, timeline riwayat kerja panjang, dan detail teknis proyek.
4. **Vertical Showcase Platforms (Behance, Dribbble, GitHub Readme, Peerlist):** Sangat terspesialisasi per profesi tertentu dan terkunci dalam ekosistem platform mereka sendiri (*platform lock-in*).

---

## 2. Analisis Kompetitor Mendalam

| Platform | Target Pengguna Utama | Fitur Unggulan | Kelebihan | Kekurangan | Model Monetisasi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Carrd.co** | Solopreneur, Personal branding, Landing page pemula | Single-page builder sederhana, responsif, custom domain | Sangat murah ($19/thn), loading super cepat, fleksibel untuk landing page sederhana | Bukan *structured resume/portfolio* data (input manual per blok), sulit update riwayat berkala | Freemium (Pro $9-$49/thn) |
| **Bento.me** | Tech enthusiast, Desainer, Kreator konten | Tampilan grid Bento 3D modern, embed rich media (GitHub, Spotify, Figma, X) | Visual sangat modern, *instant gratification*, mobile friendly | Struktur linear CV formal (pengalaman, sertifikat, edukasi) kurang terfasilitasi | Freemium (Bento Pro) |
| **Read.cv** | Desainer produk, Software engineer, Startup workers | Structured resume profile, peer endorsement, minimalist typography | Data terstruktur rapi, desain tipografi clean & editorial, ramah recruiter | Template hampir seragam (kurang variasi styling/tema), tidak ada live builder multi-tema | Gratis + Fitur Rekrutmen Perusahaan |
| **Webflow / Framer** | Desainer UI/UX, Agensi, Developer visual | No-code visual CSS editor, animasi interaktif kompleks, CMS engine | Kebebasan desain 100%, animasi tingkat tinggi | Sangat sulit untuk pengguna non-teknis, butuh waktu belajar mingguan, mahal | Berlangganan mulai \$14–\$39/bln |
| **Notion Sites / Super.so** | Mahasiswa, Notion power users, Manajer produk | Sinkronisasi langsung dari database Notion ke website publik | Kemudahan update teks seperti nulis dokumen, gratis via Notion | Tampilan default kaku (*boxy*), styling butuh add-on berbayar ($12–$20/bln), performa SEO & aset kadang lambat | Freemium (Super/Framer Notion wrappers) |
| **Bio.link / Linktree** | Influencer, Content Creator, Penjual online | Daftar link mikro vertikal, integrasi analitik klik dan social links | Setup kurang dari 3 menit, optimal untuk bio Instagram/TikTok | Terlalu sederhana; bukan website portofolio profesional untuk melamar kerja | Freemium (Fitur analitik & tema berbayar) |
| **Behance / Dribbble** | Desainer grafis, Illustrator, 3D Artist | Galeri karya visual beresolusi tinggi, apresiasi komunitas (*likes/views*) | Jangkauan rekruter kreatif global, fokus penuh pada visual karya | Tidak cocok untuk developer atau profesional non-desain; tidak memiliki domain personal mandiri | Gratis (Pro/Adobe CC subscription) |

---

## 3. Celah Pasar (Market Gaps) yang Kita Isi

Berdasarkan riset pengguna (mahasiswa, fresh graduate, freelancer, desainer, developer, dan profesional umum):

1. **The "Blank Canvas Anxiety" Trap:**
   - *Problem:* Di Webflow/Wix, user bingung memulai dari mana karena canvas kosong.
   - *Our Solution:* **Form-First, Zero-Layout Anxiety**. User hanya mengisi formulir langkah demi langkah (data profil, proyek, skill, pengalaman). Layout dihasilkan 100% otomatis oleh engine template.

2. **Perbedaan Kebutuhan Lintas Profesi:**
   - *Problem:* Platform lain biasanya condong ke desainer saja (visual heavy) ATAU developer saja (GitHub summary).
   - *Our Solution:* **Adaptive Section Architecture**. Developer mendapatkan *live repo link*, tech stack badge, and interactive preview link; Desainer mendapatkan *masonry project gallery & media zoom*; Profesional/Fresh Grad mendapatkan *ATS-friendly structured timeline & credentials showcase*.

3. **One-Click Multi-Theme Switching (Data Decoupled from Design):**
   - *Problem:* Di platform drag-and-drop, berganti template berarti mendesain ulang dari awal.
   - *Our Solution:* **Data & Presentation Separation**. Data disimpan dalam skema JSON/Database terstruktur. User bisa mengganti antara 4 tema (Minimalist, Bold/Creative, Developer/Dark, Elegant/Professional) secara instan tanpa kehilangan atau mengedit ulang data satu huruf pun.

4. **Kesiapan Melamar Kerja (Job-Application Ready):**
   - *Problem:* Portofolio web seringkali tidak praktis saat HRD meminta PDF resume.
   - *Our Solution:* **Dual Export Ecosystem** (Live Public URL + Clean Print/PDF Resume Generator yang disinkronisasi dari data yang sama).

5. **Local & Global Accessibility:**
   - *Problem:* Platform luar negeri mahal bagi fresh graduate / mahasiswa di negara berkembang (berlangganan \$12-\$29/bln).
   - *Our Solution:* Akses tier dasar gratis yang kaya fitur dengan slug publik kustom (`builder.com/u/username`), performa cepat, dan SEO-optimized out-of-the-box.
