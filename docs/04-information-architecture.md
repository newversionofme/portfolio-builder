# 04. Arsitektur Informasi & Skema Database

Dokumen ini menguraikan struktur navigasi halaman aplikasi, skema data entitas portofolio, serta skema basis data PostgreSQL (Prisma ORM) yang dirancang secara terisolasi dan modular.

---

## 1. Peta Situs & Struktur Rute (Sitemap & Routing Structure)

```
/ (Root)
│
├── (marketing)
│   ├── /                         # Landing Page (Hero, Showcase, Fitur, Template, FAQ, Footer)
│   ├── /templates                # Template Explorer & Live Demo Galeri
│   └── /pricing                  # Informasi Paket (Free vs Pro)
│
├── (auth)
│   ├── /login                    # Halaman Masuk
│   ├── /register                 # Halaman Daftar
│   └── /onboarding               # Wizard Inisiasi Akun & Pemilihan Slug
│
├── (dashboard)                   # Rute Terproteksi (Harus Login)
│   ├── /dashboard                # Overview Portofolio, Statistik & Quick Actions
│   ├── /dashboard/editor         # Multi-Tab Portfolio Form Builder + Live Preview
│   │   ├── ?tab=profile          # Profil, Kontak, & Sosial Media
│   │   ├── ?tab=about            # Bio & Narasi Karier
│   │   ├── ?tab=experience       # Riwayat Pengalaman Kerja
│   │   ├── ?tab=education        # Riwayat Pendidikan
│   │   ├── ?tab=skills           # Manajemen Skill & Kategori
│   │   ├── ?tab=projects         # Manajemen Proyek & Galeri
│   │   ├── ?tab=certifications   # Sertifikat & Lisensi
│   │   └── ?tab=appearance       # Pengaturan Template, Warna Aksen, & Tipografi
│   ├── /dashboard/settings       # Akun, Ganti Password, Export Data, Hapus Akun
│   └── /dashboard/analytics      # Statistik Pengunjung (Views, Clicks)
│
└── /u/[slug]                     # Halaman Portofolio Publik Pengguna (SSR / ISR)
```

---

## 2. Struktur Data Portofolio (JSON Schema Representation)

Setiap portofolio direpresentasikan dalam struktur data terstandarisasi yang mandiri dari tema visual:

```json
{
  "slug": "johndoe",
  "themeConfig": {
    "templateId": "developer",
    "accentColor": "#3b82f6",
    "fontFamily": "Inter",
    "sectionOrder": ["about", "skills", "projects", "experience", "education", "certifications", "testimonials", "contact"],
    "hiddenSections": []
  },
  "profile": {
    "fullName": "John Doe",
    "headline": "Senior Full-Stack Engineer & Open Source Enthusiast",
    "avatarUrl": "https://...",
    "location": "Jakarta, Indonesia",
    "availableForHire": true,
    "hireBadgeText": "Open for Full-time & Contract Roles"
  },
  "about": {
    "bio": "Software engineer with 5+ years of experience building scalable web apps...",
    "keyHighlights": ["5+ Years Exp", "15+ Production Apps", "10k+ GitHub Stars"]
  },
  "contact": {
    "email": "john@example.com",
    "phone": "+628123456789",
    "enableContactForm": true
  },
  "socials": [
    { "platform": "github", "url": "https://github.com/johndoe" },
    { "platform": "linkedin", "url": "https://linkedin.com/in/johndoe" },
    { "platform": "twitter", "url": "https://x.com/johndoe" }
  ],
  "experiences": [
    {
      "id": "exp_1",
      "company": "Tech Corp",
      "position": "Lead Software Engineer",
      "employmentType": "Full-time",
      "location": "Remote",
      "startDate": "2022-01-01",
      "endDate": null,
      "isCurrent": true,
      "description": "Architected microservices using Node.js and PostgreSQL. Improved query speeds by 40%."
    }
  ],
  "educations": [
    {
      "id": "edu_1",
      "institution": "Universitas Indonesia",
      "degree": "Bachelor of Computer Science",
      "startDate": "2018-08-01",
      "endDate": "2022-07-01",
      "gpa": "3.85 / 4.00",
      "description": "Thesis on Distributed Systems. Graduated Cum Laude."
    }
  ],
  "skills": [
    { "id": "sk_1", "name": "TypeScript", "category": "Frontend / Backend", "level": "Expert" },
    { "id": "sk_2", "name": "Next.js", "category": "Frontend", "level": "Expert" },
    { "id": "sk_3", "name": "PostgreSQL", "category": "Database", "level": "Advanced" }
  ],
  "projects": [
    {
      "id": "proj_1",
      "title": "CloudMetrics SaaS",
      "tagline": "Real-time infrastructure monitoring dashboard",
      "description": "High-throughput telemetry dashboard handling 1M+ metrics per minute with automated alerting.",
      "imageUrl": "https://...",
      "tags": ["Next.js", "TypeScript", "Tailwind CSS", "Go", "ClickHouse"],
      "liveUrl": "https://cloudmetrics.io",
      "githubUrl": "https://github.com/johndoe/cloudmetrics",
      "isFeatured": true
    }
  ],
  "certifications": [
    {
      "id": "cert_1",
      "title": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issueDate": "2023-05-15",
      "expiryDate": "2026-05-15",
      "credentialUrl": "https://aws.amazon.com/verify/..."
    }
  ],
  "testimonials": [
    {
      "id": "test_1",
      "name": "Sarah Jenkins",
      "role": "VP of Engineering at Tech Corp",
      "quote": "John is an exceptional engineer whose technical leadership was instrumental in scaling our core product.",
      "avatarUrl": "https://..."
    }
  ]
}
```

---

## 3. Skema Basis Data Lengkap (Prisma Schema)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------
// USER & AUTHENTICATION (NextAuth v5 / Auth.js standard)
// -------------------------------------------------------------
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String          @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  accounts      Account[]
  sessions      Session[]
  portfolio     Portfolio?

  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// -------------------------------------------------------------
// PORTFOLIO CORE
// -------------------------------------------------------------
enum PortfolioStatus {
  DRAFT
  PUBLISHED
}

model Portfolio {
  id               String          @id @default(cuid())
  userId           String          @unique
  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  slug             String          @unique
  status           PortfolioStatus @default(DRAFT)
  publishedAt      DateTime?
  
  // Visual Theme Config
  templateId       String          @default("minimalist") // "minimalist" | "bold" | "developer" | "elegant"
  accentColor      String          @default("#3b82f6")
  fontFamily       String          @default("Inter")
  customCss        String?         @db.Text
  sectionOrder     Json?           // Array of section keys: ["about", "skills", "projects", ...]
  hiddenSections   Json?           // Array of section keys to hide

  // SEO & Meta Tags
  seoTitle         String?
  seoDescription   String?
  ogImageUrl       String?

  // Section Relations
  profile          Profile?
  about            About?
  contactInfo      ContactInfo?
  experiences      Experience[]
  educations       Education[]
  skills           Skill[]
  projects         Project[]
  certifications   Certification[]
  testimonials     Testimonial[]
  socialLinks      SocialLink[]
  analytics        Analytics[]

  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  @@index([slug])
}

// -------------------------------------------------------------
// PORTFOLIO SECTIONS
// -------------------------------------------------------------
model Profile {
  id               String    @id @default(cuid())
  portfolioId      String    @unique
  portfolio        Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  fullName         String
  headline         String    // e.g. "Product Designer & UI Specialist"
  avatarUrl        String?
  bannerUrl        String?
  location         String?   // e.g. "Jakarta, Indonesia"
  availableForHire Boolean   @default(true)
  hireBadgeText    String?   @default("Available for work")
  resumePdfUrl     String?   // Downloadable CV link
  
  updatedAt        DateTime  @updatedAt
}

model About {
  id               String    @id @default(cuid())
  portfolioId      String    @unique
  portfolio        Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  bio              String    @db.Text
  keyHighlights    Json?     // Array of strings or bullet tags
  
  updatedAt        DateTime  @updatedAt
}

model ContactInfo {
  id                String    @id @default(cuid())
  portfolioId       String    @unique
  portfolio         Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  email             String?
  phone             String?
  whatsapp          String?
  enableContactForm Boolean   @default(true)
  
  updatedAt         DateTime  @updatedAt
}

model SocialLink {
  id          String    @id @default(cuid())
  portfolioId String
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  platform    String    // "github", "linkedin", "twitter", "dribbble", "instagram", "youtube", "website"
  url         String
  order       Int       @default(0)

  @@index([portfolioId])
}

model Experience {
  id             String    @id @default(cuid())
  portfolioId    String
  portfolio      Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  company        String
  companyUrl     String?
  position       String
  employmentType String?   // "Full-time", "Part-time", "Contract", "Freelance", "Internship"
  location       String?
  startDate      DateTime
  endDate        DateTime?
  isCurrent      Boolean   @default(false)
  description    String?   @db.Text
  order          Int       @default(0)

  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([portfolioId])
}

model Education {
  id          String    @id @default(cuid())
  portfolioId String
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  institution String
  degree      String    // e.g. "Bachelor of Science in Computer Science"
  fieldOfStudy String?
  startDate   DateTime
  endDate     DateTime?
  isCurrent   Boolean   @default(false)
  gpa         String?
  description String?   @db.Text
  order       Int       @default(0)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([portfolioId])
}

model Skill {
  id          String    @id @default(cuid())
  portfolioId String
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  name        String
  category    String?   // "Frontend", "Backend", "Design", "DevOps", "Soft Skills"
  level       String?   // "Beginner", "Intermediate", "Advanced", "Expert"
  order       Int       @default(0)

  @@index([portfolioId])
}

model Project {
  id          String    @id @default(cuid())
  portfolioId String
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  title       String
  tagline     String?
  description String    @db.Text
  imageUrl    String?
  galleryUrls Json?     // Array of additional image URLs
  tags        Json?     // Array of tech stack tags: ["React", "Tailwind", "Node.js"]
  liveUrl     String?
  githubUrl   String?
  isFeatured  Boolean   @default(false)
  order       Int       @default(0)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([portfolioId])
}

model Certification {
  id            String    @id @default(cuid())
  portfolioId   String
  portfolio     Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  title         String
  issuer        String
  issueDate     DateTime
  expiryDate    DateTime?
  credentialId  String?
  credentialUrl String?
  order         Int       @default(0)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([portfolioId])
}

model Testimonial {
  id          String    @id @default(cuid())
  portfolioId String
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  name        String
  role        String    // e.g. "Engineering Manager"
  company     String?
  quote       String    @db.Text
  avatarUrl   String?
  order       Int       @default(0)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([portfolioId])
}

// -------------------------------------------------------------
// ANALYTICS & PAGE VIEWS
// -------------------------------------------------------------
model Analytics {
  id          String    @id @default(cuid())
  portfolioId String
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  eventType   String    // "page_view", "link_click", "resume_download"
  metadata    Json?     // User agent, country code, referer, link destination
  createdAt   DateTime  @default(now())

  @@index([portfolioId, createdAt])
}
```
