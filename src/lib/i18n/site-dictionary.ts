export type SiteLanguage = 'id' | 'en';

export interface SiteDictionary {
  nav: {
    features: string;
    templates: string;
    howItWorks: string;
    login: string;
    register: string;
    dashboard: string;
    createPortfolio: string;
    language: string;
    menu: string;
    closeMenu: string;
    navigationLabel: string;
  };
  theme: {
    label: string;
    light: string;
    dark: string;
    system: string;
    reset: string;
    activeTitle: string;
    ariaSettings: string;
    toggleAria: string;
  };
  actionsMenu: {
    portfolioLanguage: string;
    appearanceMode: string;
    settingsAria: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    tryDemo: string;
    trustFree: string;
    trustSlug: string;
    trustSsr: string;
    demoTitle: string;
    loginDemo: string;
  };
  templates: {
    sectionBadge: string;
    title: string;
    subtitle: string;
    minimalist: {
      title: string;
      tagline: string;
      description: string;
    };
    bold: {
      title: string;
      tagline: string;
      description: string;
    };
    elegant: {
      title: string;
      tagline: string;
      description: string;
    };
    developer: {
      title: string;
      tagline: string;
      description: string;
    };
  };
  features: {
    sectionBadge: string;
    title: string;
    subtitle: string;
    item1: {
      title: string;
      desc: string;
    };
    item2: {
      title: string;
      desc: string;
    };
    item3: {
      title: string;
      desc: string;
    };
    item4: {
      title: string;
      desc: string;
    };
  };
  ctaBanner: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    tagline: string;
    rights: string;
    builtWith: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    emailLabel: string;
    passwordLabel: string;
    nameLabel: string;
    loginButton: string;
    registerButton: string;
    orContinueWith: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    registerLink: string;
    loginLink: string;
    tagline: string;
    rights: string;
  };
  dashboard: {
    greeting: string;
    title: string;
    subtitle: string;
    editPortfolio: string;
    viewPublicPortfolio: string;
    logout: string;
    statusPublished: string;
    statusDraft: string;
    statusSectionTitle: string;
    checklistTitle: string;
    checklistSubtitle: string;
    readyToPublish: string;
    stepProfile: string;
    stepAbout: string;
    stepProjects: string;
    stepTemplate: string;
  };
  editor: {
    headerTitle: string;
    backToDashboard: string;
    saving: string;
    saved: string;
    failed: string;
    retry: string;
    ready: string;
    export: string;
    downloadPdf: string;
    pdfDesc: string;
    downloadShareCard: string;
    shareCardDesc: string;
    downloadFullPage: string;
    fullPageDesc: string;
    copyLink: string;
    openWeb: string;
    previewViewport: string;
    publish: string;
    published: string;
    publishing: string;
    unpublishing: string;
    publishedSuccess: string;
    draftSuccess: string;
    copiedSuccess: string;
    completeness: string;
    itemsFilled: string;
    allSections: string;
    sectionsList: string;
    sectionsListDesc: string;
    sectionNumber: string;
    next: string;
    prev: string;
    allDone: string;
    tabNames: {
      profile: string;
      about: string;
      experience: string;
      education: string;
      skills: string;
      projects: string;
      certifications: string;
      testimonials: string;
      contact: string;
      appearance: string;
    };
  };
  languageNames: {
    id: string;
    en: string;
  };
}

export const siteDictionaries: Record<SiteLanguage, SiteDictionary> = {
  id: {
    nav: {
      features: 'Fitur',
      templates: 'Template',
      howItWorks: 'Cara Kerja',
      login: 'Masuk',
      register: 'Daftar',
      dashboard: 'Dashboard',
      createPortfolio: 'Buat Portofolio',
      language: 'Bahasa',
      menu: 'Buka Menu',
      closeMenu: 'Tutup Menu',
      navigationLabel: 'Navigasi',
    },
    theme: {
      label: 'Tema Tampilan',
      light: 'Terang (Light)',
      dark: 'Gelap (Dark)',
      system: 'Sistem (Device)',
      reset: 'Reset ke Pengaturan Default',
      activeTitle: 'Tema aktif',
      ariaSettings: 'Pengaturan tema tampilan',
      toggleAria: 'Toggle tema tampilan',
    },
    actionsMenu: {
      portfolioLanguage: 'Bahasa Portofolio',
      appearanceMode: 'Mode Tampilan',
      settingsAria: 'Pengaturan Bahasa & Tema',
    },
    hero: {
      badge: 'Form-First • Zero Coding • 4 Template Terkurasi',
      titleStart: 'Cukup Isi Formulir, ',
      titleHighlight: 'Website Portofolio Siap Rilis',
      subtitle:
        'Tanpa pusing coding atau mendesain dari canvas kosong. Masukkan riwayat, proyek, dan keahlian Anda, lalu publikasikan tautan portofolio profesional dalam 5 menit.',
      ctaPrimary: 'Buat Portofolio Sekarang',
      ctaSecondary: 'Lihat Contoh Portofolio',
      tryDemo: 'Coba Akun Demo',
      trustFree: '100% Gratis untuk MVP',
      trustSlug: 'Link Publik Unik /u/slug',
      trustSsr: 'Performa Cepat (SSR)',
      demoTitle: 'Akun Demo Lokal (Testing):',
      loginDemo: 'Masuk Demo',
    },
    templates: {
      sectionBadge: 'Koleksi Desain',
      title: '4 Konsep Template Terkurasi',
      subtitle:
        'Data Anda terpisah secara modular dari tampilan. Ganti tema kapan saja dalam 1 klik tanpa kehilangan data.',
      minimalist: {
        title: 'Minimalist',
        tagline: 'Clean & Editorial',
        description:
          'Fokus pada whitespace, tipografi rapi, dan esensi konten. Ideal untuk fresh graduate & profesional korporat.',
      },
      bold: {
        title: 'Bold / Creative',
        tagline: 'Cyberpunk Bento & Neon',
        description:
          'Tata letak bento modern dengan ambient glow dan aksen ekspresif. Sempurna untuk desainer, UI/UX, dan kreator konten.',
      },
      elegant: {
        title: 'Elegant Dossier',
        tagline: 'Luxury Editorial Linen',
        description:
          'Nuansa editorial koran klasik dengan tipografi serif mewah. Sangat cocok untuk konsultan, peneliti, dan akademisi.',
      },
      developer: {
        title: 'Developer Terminal',
        tagline: 'GitHub Dark / IDE Hacker',
        description:
          'Antarmuka terminal interaktif dengan git log style timeline dan repository view. Dirancang khusus untuk programmer & engineer.',
      },
    },
    features: {
      sectionBadge: 'Keunggulan Platform',
      title: 'Semua Kebutuhan Portofolio dalam Satu Solusi',
      subtitle: 'Dirancang agar Anda fokus pada pencapaian karier, bukan kerumitan teknis.',
      item1: {
        title: 'Formulir Terstruktur',
        desc: 'Panduan pengisian data riwayat karier, sertifikasi, keahlian, dan studi kasus proyek yang rapi.',
      },
      item2: {
        title: 'Multi-Tema & Dual Mode',
        desc: 'Setiap tema mendukung mode Terang (Light) dan Gelap (Dark) dengan kontras tinggi dan estetika terkalibrasi.',
      },
      item3: {
        title: 'Ekspor Multi-Format',
        desc: 'Unduh CV PDF siap cetak berstandar ATS, kartu bagikan OpenGraph 1200×630, atau tangkapan layar penuh.',
      },
      item4: {
        title: 'Bilingual Otomatis',
        desc: 'Dukungan penuh multi-bahasa Indonesia dan Inggris, baik di website builder maupun di link portofolio Anda.',
      },
    },
    ctaBanner: {
      title: 'Siap Luncurkan Portofolio Profesional Anda?',
      subtitle: 'Bergabunglah sekarang. Gratis, tanpa perlu kartu kredit, langsung rilis link Anda hari ini.',
      button: 'Mulai Sekarang Gratis',
    },
    footer: {
      tagline: 'Platform pembuat website portofolio modern tanpa coding.',
      rights: 'Seluruh hak cipta dilindungi.',
      builtWith: 'Dibuat dengan Next.js, Tailwind CSS & TypeScript.',
    },
    auth: {
      loginTitle: 'Masuk ke Akun',
      loginSubtitle: 'Kelola dan publikasikan portofolio Anda.',
      registerTitle: 'Buat Akun Baru',
      registerSubtitle: 'Mulai buat website portofolio profesional Anda.',
      emailLabel: 'Alamat Email',
      passwordLabel: 'Kata Sandi',
      nameLabel: 'Nama Lengkap',
      loginButton: 'Masuk',
      registerButton: 'Daftar Sekarang',
      orContinueWith: 'atau lanjutkan dengan',
      dontHaveAccount: 'Belum punya akun?',
      alreadyHaveAccount: 'Sudah punya akun?',
      registerLink: 'Daftar di sini',
      loginLink: 'Masuk di sini',
      tagline: 'Platform Portofolio Instan & Modern.',
      rights: 'Seluruh hak cipta dilindungi.',
    },
    dashboard: {
      greeting: 'Halo',
      title: 'Website Portofolio Anda',
      subtitle: 'Kelola data profil, karya, dan publikasikan tautan online Anda dalam hitungan detik.',
      editPortfolio: 'Edit Portofolio',
      viewPublicPortfolio: 'Lihat Portofolio Publik',
      logout: 'Keluar',
      statusPublished: 'Sudah Rilis Online',
      statusDraft: 'Draft (Belum Rilis)',
      statusSectionTitle: 'Status Publikasi',
      checklistTitle: 'Checklist Kelengkapan',
      checklistSubtitle: 'Lengkapi 4 langkah dasar ini agar portofolio Anda siap memikat recruiter.',
      readyToPublish: 'Siap Dipublikasikan',
      stepProfile: 'Data Profil & Identitas',
      stepAbout: 'Ringkasan & Bio Singkat',
      stepProjects: 'Minimal 1 Proyek / Karya',
      stepTemplate: 'Pilih Template & Tema',
    },
    editor: {
      headerTitle: 'Editor Portofolio',
      backToDashboard: 'Kembali ke Dashboard',
      saving: 'Menyimpan...',
      saved: 'Tersimpan',
      failed: 'Gagal',
      retry: 'Coba simpan ulang',
      ready: 'Siap',
      export: 'Ekspor',
      downloadPdf: 'Unduh CV (PDF)',
      pdfDesc: 'Standar ATS format A4',
      downloadShareCard: 'Unduh Kartu Bagikan',
      shareCardDesc: 'Ukuran 1200×630',
      downloadFullPage: 'Unduh Halaman Penuh',
      fullPageDesc: 'Tangkapan layar 1280px',
      copyLink: 'Salin Link',
      openWeb: 'Buka Web',
      previewViewport: 'Pratinjau Layar',
      publish: 'Publish',
      published: 'Published',
      publishing: 'Mempublikasikan...',
      unpublishing: 'Mengubah...',
      publishedSuccess: 'Portofolio berhasil dipublikasikan!',
      draftSuccess: 'Status portofolio diubah menjadi Draft.',
      copiedSuccess: 'Tautan berhasil disalin ke clipboard!',
      completeness: 'Kelengkapan',
      itemsFilled: 'bagian terisi',
      allSections: 'Semua Bagian',
      sectionsList: 'Daftar Bagian Portofolio',
      sectionsListDesc: 'bagian telah terisi. Pilih bagian untuk langsung melompat.',
      sectionNumber: 'Bagian',
      next: 'Lanjut ke',
      prev: 'Kembali',
      allDone: 'Selesai (Semua Bagian Terkonfigurasi)',
      tabNames: {
        profile: 'Profil Utama',
        about: 'Tentang Saya',
        experience: 'Pengalaman',
        education: 'Pendidikan',
        skills: 'Keahlian',
        projects: 'Proyek',
        certifications: 'Sertifikat',
        testimonials: 'Testimoni',
        contact: 'Kontak & Sosial',
        appearance: 'Tampilan & Tema',
      },
    },
    languageNames: {
      id: 'Bahasa Indonesia',
      en: 'English',
    },
  },
  en: {
    nav: {
      features: 'Features',
      templates: 'Templates',
      howItWorks: 'How It Works',
      login: 'Sign In',
      register: 'Sign Up',
      dashboard: 'Dashboard',
      createPortfolio: 'Build Portfolio',
      language: 'Language',
      menu: 'Open Menu',
      closeMenu: 'Close Menu',
      navigationLabel: 'Navigation',
    },
    theme: {
      label: 'Appearance',
      light: 'Light',
      dark: 'Dark',
      system: 'System (Device)',
      reset: 'Reset to Default',
      activeTitle: 'Active theme',
      ariaSettings: 'Theme appearance settings',
      toggleAria: 'Toggle appearance theme',
    },
    actionsMenu: {
      portfolioLanguage: 'Portfolio Language',
      appearanceMode: 'Appearance Mode',
      settingsAria: 'Language & Theme Settings',
    },
    hero: {
      badge: 'Form-First • Zero Coding • 4 Curated Templates',
      titleStart: 'Just Fill the Form, ',
      titleHighlight: 'Your Portfolio is Ready to Launch',
      subtitle:
        'No coding or blank-canvas design headaches. Input your experiences, projects, and skills, then publish your verified professional portfolio in 5 minutes.',
      ctaPrimary: 'Build Your Portfolio Now',
      ctaSecondary: 'View Live Examples',
      tryDemo: 'Try Demo Account',
      trustFree: '100% Free for MVP',
      trustSlug: 'Unique Public URL /u/slug',
      trustSsr: 'Lightning Fast (SSR)',
      demoTitle: 'Local Demo Account (Testing):',
      loginDemo: 'Demo Login',
    },
    templates: {
      sectionBadge: 'Design Showcase',
      title: '4 Curated Design Templates',
      subtitle:
        'Your content is separated modularly from presentation. Switch themes anytime in 1 click without losing data.',
      minimalist: {
        title: 'Minimalist',
        tagline: 'Clean & Editorial',
        description:
          'Emphasizes refined whitespace, clean typography, and core content. Ideal for fresh graduates and business professionals.',
      },
      bold: {
        title: 'Bold / Creative',
        tagline: 'Cyberpunk Bento & Neon',
        description:
          'Modern bento layout with ambient glows and high-impact visual flair. Perfect for designers, UI/UX, and creatives.',
      },
      elegant: {
        title: 'Elegant Dossier',
        tagline: 'Luxury Editorial Linen',
        description:
          'Classic broadsheet editorial aesthetic with distinguished serif typography. Well-suited for consultants, researchers, and academics.',
      },
      developer: {
        title: 'Developer Terminal',
        tagline: 'GitHub Dark / IDE Hacker',
        description:
          'Interactive terminal interface with git-log style experience and repository view. Tailor-made for software engineers.',
      },
    },
    features: {
      sectionBadge: 'Platform Highlights',
      title: 'Everything You Need in One Unified Platform',
      subtitle: 'Designed so you can focus on sharing your career highlights, not wrestling with CSS.',
      item1: {
        title: 'Structured Input Forms',
        desc: 'Step-by-step guidance to capture your career story, certifications, skills, and project case studies cleanly.',
      },
      item2: {
        title: 'Multi-Theme & Dual Mode',
        desc: 'Every template natively supports Dark & Light mode with calibrated contrast and tailored aesthetics.',
      },
      item3: {
        title: 'Multi-Format Export',
        desc: 'Download an ATS-friendly A4 PDF resume, 1200×630 OpenGraph social share cards, or full-page captures in seconds.',
      },
      item4: {
        title: 'Automatic Bilingualism',
        desc: 'Comprehensive English & Indonesian language support, across the builder and on your published public portfolio.',
      },
    },
    ctaBanner: {
      title: 'Ready to Launch Your Professional Portfolio?',
      subtitle: 'Join now. Free forever on MVP, no credit card required, publish your public link today.',
      button: 'Get Started for Free',
    },
    footer: {
      tagline: 'The modern zero-coding portfolio builder platform.',
      rights: 'All rights reserved.',
      builtWith: 'Crafted with Next.js, Tailwind CSS & TypeScript.',
    },
    auth: {
      loginTitle: 'Sign In to Your Account',
      loginSubtitle: 'Manage and publish your verified portfolio.',
      registerTitle: 'Create New Account',
      registerSubtitle: 'Start creating your professional portfolio in minutes.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      loginButton: 'Sign In',
      registerButton: 'Sign Up Now',
      orContinueWith: 'or continue with',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      registerLink: 'Sign up here',
      loginLink: 'Sign in here',
      tagline: 'Instant & Modern Portfolio Platform.',
      rights: 'All rights reserved.',
    },
    dashboard: {
      greeting: 'Hello',
      title: 'Your Portfolio Website',
      subtitle: 'Manage profile data, projects, and publish your online link in seconds.',
      editPortfolio: 'Edit Portfolio',
      viewPublicPortfolio: 'View Public Portfolio',
      logout: 'Log Out',
      statusPublished: 'Published Online',
      statusDraft: 'Draft (Unpublished)',
      statusSectionTitle: 'Publication Status',
      checklistTitle: 'Readiness Checklist',
      checklistSubtitle: 'Complete these 4 fundamental steps to make your portfolio recruiter-ready.',
      readyToPublish: 'Ready to Publish',
      stepProfile: 'Profile Info & Details',
      stepAbout: 'Summary & Bio',
      stepProjects: 'At least 1 Project',
      stepTemplate: 'Choose Template & Theme',
    },
    editor: {
      headerTitle: 'Portfolio Editor',
      backToDashboard: 'Back to Dashboard',
      saving: 'Saving...',
      saved: 'Saved',
      failed: 'Failed',
      retry: 'Retry save',
      ready: 'Ready',
      export: 'Export',
      downloadPdf: 'Download CV (PDF)',
      pdfDesc: 'ATS Standard A4 Format',
      downloadShareCard: 'Download Share Card',
      shareCardDesc: 'Size 1200×630',
      downloadFullPage: 'Download Full Page',
      fullPageDesc: 'Full page capture 1280px',
      copyLink: 'Copy Link',
      openWeb: 'Open Web',
      previewViewport: 'Preview Viewport',
      publish: 'Publish',
      published: 'Published',
      publishing: 'Publishing...',
      unpublishing: 'Updating...',
      publishedSuccess: 'Portfolio successfully published!',
      draftSuccess: 'Portfolio status changed to Draft.',
      copiedSuccess: 'Link successfully copied to clipboard!',
      completeness: 'Completeness',
      itemsFilled: 'sections filled',
      allSections: 'All Sections',
      sectionsList: 'Portfolio Sections List',
      sectionsListDesc: 'sections completed. Select a section to jump directly.',
      sectionNumber: 'Section',
      next: 'Next:',
      prev: 'Back',
      allDone: 'Done (All Sections Configured)',
      tabNames: {
        profile: 'Main Profile',
        about: 'About Me',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        projects: 'Projects',
        certifications: 'Certifications',
        testimonials: 'Testimonials',
        contact: 'Contact & Socials',
        appearance: 'Theme & Appearance',
      },
    },
    languageNames: {
      id: 'Bahasa Indonesia',
      en: 'English',
    },
  },
};
