export type SupportedLanguage = 'id' | 'en';

export interface Dictionary {
  // Navigation & Headers
  cvDossier: string;
  inquire: string;
  getInTouch: string;
  availableForHire: string;
  openToWork: string;
  viewStudy: string;
  sourceCode: string;
  downloadResume: string;
  present: string;
  gpa: string;
  verifyCredential: string;
  issuedBy: string;
  issued: string;
  expires: string;
  credentialId: string;
  
  // Section Titles
  sections: {
    about: string;
    skills: string;
    projects: string;
    experience: string;
    education: string;
    certifications: string;
    testimonials: string;
    contact: string;
  };

  // Section Subtitles / Descriptions
  subtitles: {
    about: string;
    skills: string;
    projects: string;
    experience: string;
    education: string;
    certifications: string;
    testimonials: string;
    contact: string;
  };

  // Summary / At a Glance
  atAGlance: {
    title: string;
    currentRole: string;
    latestEducation: string;
    coreCompetencies: string;
    location: string;
    status: string;
    available: string;
  };

  // Contact Form & Channels
  contact: {
    email: string;
    whatsapp: string;
    phone: string;
    copyEmail: string;
    copied: string;
    sendDirectMessage: string;
    initiateInquiry: string;
    inquirySubject: string;
  };

  // CV & Export Labels
  cvExport: {
    downloadCv: string;
    downloading: string;
    includeAvatar: string;
    includeAvatarHelp: string;
    curatedPortfolio: string;
    page: string;
    of: string;
    role: string;
    technologies: string;
  };

  // Footer & Colophon
  footer: {
    allRightsReserved: string;
    curatedWith: string;
  };
}

export const dictionaries: Record<SupportedLanguage, Dictionary> = {
  id: {
    cvDossier: 'Curriculum Vitae',
    inquire: 'Hubungi',
    getInTouch: 'Mulai Kolaborasi',
    availableForHire: 'Tersedia untuk Pekerjaan',
    openToWork: 'Siap Berkontribusi',
    viewStudy: 'Lihat Proyek',
    sourceCode: 'Kode Sumber',
    downloadResume: 'Unduh CV / Resume',
    present: 'Sekarang',
    gpa: 'IPK',
    verifyCredential: 'Verifikasi Kredensial',
    issuedBy: 'Diterbitkan oleh',
    issued: 'Terbit',
    expires: 'Berlaku s/d',
    credentialId: 'No. Kredensial',
    
    sections: {
      about: 'Tentang & Profil',
      skills: 'Keahlian & Kompetensi',
      projects: 'Portofolio & Karya',
      experience: 'Pengalaman Kerja',
      education: 'Riwayat Pendidikan',
      certifications: 'Sertifikasi & Lisensi',
      testimonials: 'Rekomendasi & Testimoni',
      contact: 'Kontak & Kolaborasi',
    },

    subtitles: {
      about: 'Ringkasan profesional dan fokus spesialisasi',
      skills: 'Teknologi dan keahlian yang dikuasai',
      projects: 'Koleksi studi kasus dan karya terbaik',
      experience: 'Jejak langkah karier dan kontribusi profesional',
      education: 'Latar belakang akademis formal',
      certifications: 'Kredensial dan sertifikasi profesional',
      testimonials: 'Apa kata rekan kerja dan kolaborator',
      contact: 'Mari berdiskusi dan membangun proyek bersama',
    },

    atAGlance: {
      title: 'Sekilas',
      currentRole: 'Peran Terkini',
      latestEducation: 'Pendidikan Terakhir',
      coreCompetencies: 'Keahlian Utama',
      location: 'Domisili',
      status: 'Status',
      available: 'Siap Menerima Proyek / Tawaran',
    },

    contact: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      phone: 'Telepon',
      copyEmail: 'Salin Email',
      copied: 'Tersalin!',
      sendDirectMessage: 'Kirim Pesan Langsung',
      initiateInquiry: 'Kirim Pesan Formal',
      inquirySubject: 'Inquiry Portofolio',
    },

    cvExport: {
      downloadCv: 'Unduh CV (PDF)',
      downloading: 'Menyiapkan CV...',
      includeAvatar: 'Sertakan foto profil',
      includeAvatarHelp: 'Format standar ramah ATS disarankan tanpa foto.',
      curatedPortfolio: 'Portofolio Online',
      page: 'Halaman',
      of: 'dari',
      role: 'Peran',
      technologies: 'Teknologi',
    },

    footer: {
      allRightsReserved: 'Hak cipta dilindungi undang-undang.',
      curatedWith: 'Dibuat dengan Portfolio Builder',
    },
  },

  en: {
    cvDossier: 'Curriculum Vitae',
    inquire: 'Inquire',
    getInTouch: 'Get in Touch',
    availableForHire: 'Available for Hire',
    openToWork: 'Open to Opportunities',
    viewStudy: 'View Project',
    sourceCode: 'Source Code',
    downloadResume: 'Download Resume',
    present: 'Present',
    gpa: 'GPA',
    verifyCredential: 'Verify Credential',
    issuedBy: 'Issued by',
    issued: 'Issued',
    expires: 'Expires',
    credentialId: 'Credential ID',

    sections: {
      about: 'About & Overview',
      skills: 'Skills & Competencies',
      projects: 'Featured Projects & Works',
      experience: 'Professional Experience',
      education: 'Academic Background',
      certifications: 'Certifications & Licenses',
      testimonials: 'Endorsements & Testimonials',
      contact: 'Contact & Inquiries',
    },

    subtitles: {
      about: 'Professional biography and core focus areas',
      skills: 'Technologies and proficiencies mastered',
      projects: 'A curated selection of key works and case studies',
      experience: 'Career milestones and organizational impact',
      education: 'Formal academic background and honors',
      certifications: 'Verified professional credentials and awards',
      testimonials: 'Feedback from partners and collaborators',
      contact: 'Available for selective engagements and consultation',
    },

    atAGlance: {
      title: 'At a Glance',
      currentRole: 'Current Position',
      latestEducation: 'Latest Degree',
      coreCompetencies: 'Core Competencies',
      location: 'Location',
      status: 'Status',
      available: 'Available for Hire & Consultation',
    },

    contact: {
      email: 'Email',
      whatsapp: 'WhatsApp',
      phone: 'Phone',
      copyEmail: 'Copy Email',
      copied: 'Copied!',
      sendDirectMessage: 'Send Direct Message',
      initiateInquiry: 'Initiate Inquiry',
      inquirySubject: 'Portfolio Inquiry',
    },

    cvExport: {
      downloadCv: 'Download CV (PDF)',
      downloading: 'Generating CV...',
      includeAvatar: 'Include profile photo',
      includeAvatarHelp: 'ATS-friendly standard format recommends excluding photos.',
      curatedPortfolio: 'Online Portfolio',
      page: 'Page',
      of: 'of',
      role: 'Role',
      technologies: 'Technologies',
    },

    footer: {
      allRightsReserved: 'All rights reserved.',
      curatedWith: 'Crafted with Portfolio Builder',
    },
  },
};

export function getDictionary(lang?: string | null): Dictionary {
  if (lang === 'en') return dictionaries.en;
  return dictionaries.id;
}
