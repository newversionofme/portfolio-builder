import { PrismaClient, PortfolioStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('⛔ ERROR: Seeding is blocked in production environment to prevent data loss.');
    process.exit(1);
  }

  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records
  await prisma.analytics.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.about.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data.');

  // 2. Create demo password hash
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 3. Create Demo User 1: Alex Rivera (Full-Stack Engineer)
  const alexUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      passwordHash,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
  });

  // 4. Create Full Portfolio for Alex Rivera
  await prisma.portfolio.create({
    data: {
      userId: alexUser.id,
      slug: 'alex-rivera',
      status: PortfolioStatus.PUBLISHED,
      publishedAt: new Date(),
      templateId: 'developer',
      accentColor: '#3b82f6',
      fontFamily: 'Inter',
      seoTitle: 'Alex Rivera | Senior Full-Stack Engineer Portfolio',
      seoDescription: 'Senior Software Engineer specializing in Next.js, TypeScript, Distributed Systems, and Cloud Architecture.',
      sectionOrder: [
        'about',
        'skills',
        'projects',
        'experience',
        'education',
        'certifications',
        'testimonials',
        'contact',
      ],
      hiddenSections: [],
      profile: {
        create: {
          fullName: 'Alex Rivera',
          headline: 'Senior Full-Stack Engineer & Cloud Architect',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          location: 'San Francisco, CA (Open to Remote)',
          availableForHire: true,
          hireBadgeText: 'Available for full-time & consulting roles',
        },
      },
      about: {
        create: {
          bio: 'I am a passionate software engineer with over 6 years of experience building high-performance web applications and distributed backend microservices. I bridge the gap between polished user experiences and robust cloud architectures.',
          keyHighlights: [
            '6+ Years Experience',
            '100k+ Active Users Served',
            'Open Source Contributor',
            'Cloud Architecture Expert',
          ],
        },
      },
      contactInfo: {
        create: {
          email: 'alex.rivera@example.com',
          phone: '+1 (555) 234-5678',
          enableContactForm: true,
        },
      },
      socialLinks: {
        create: [
          { platform: 'github', url: 'https://github.com', order: 1 },
          { platform: 'linkedin', url: 'https://linkedin.com', order: 2 },
          { platform: 'twitter', url: 'https://x.com', order: 3 },
          { platform: 'website', url: 'https://alexrivera.dev', order: 4 },
        ],
      },
      experiences: {
        create: [
          {
            company: 'Vercel Ecosystem Labs',
            companyUrl: 'https://vercel.com',
            position: 'Lead Full-Stack Engineer',
            employmentType: 'Full-time',
            location: 'Remote',
            startDate: new Date('2022-03-01'),
            isCurrent: true,
            description: 'Architected high-throughput Next.js applications and edge caching layers. Improved Core Web Vitals across 20+ micro-frontends, reducing LCP by 45%. Led a cross-functional squad of 7 engineers.',
            order: 1,
          },
          {
            company: 'CloudScale Technologies',
            companyUrl: 'https://example.com',
            position: 'Software Engineer II',
            employmentType: 'Full-time',
            location: 'San Francisco, CA',
            startDate: new Date('2019-06-01'),
            endDate: new Date('2022-02-28'),
            isCurrent: false,
            description: 'Built distributed telemetry ingestion pipelines handling 50k events/sec with Node.js and PostgreSQL. Migrated legacy monolith into containerized services on AWS ECS.',
            order: 2,
          },
        ],
      },
      educations: {
        create: [
          {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science in Computer Science',
            fieldOfStudy: 'Computer Science & Software Engineering',
            startDate: new Date('2015-08-01'),
            endDate: new Date('2019-05-30'),
            isCurrent: false,
            gpa: '3.88 / 4.00',
            description: 'Honors in Distributed Systems. President of the Open Source Developers Club.',
            order: 1,
          },
        ],
      },
      skills: {
        create: [
          { name: 'TypeScript', category: 'Languages', level: 'Expert', order: 1 },
          { name: 'Next.js / React', category: 'Frontend', level: 'Expert', order: 2 },
          { name: 'Node.js', category: 'Backend', level: 'Expert', order: 3 },
          { name: 'PostgreSQL & Prisma', category: 'Database', level: 'Expert', order: 4 },
          { name: 'Tailwind CSS', category: 'Frontend', level: 'Expert', order: 5 },
          { name: 'Docker & Kubernetes', category: 'DevOps', level: 'Advanced', order: 6 },
          { name: 'AWS Cloud Architecture', category: 'Cloud', level: 'Advanced', order: 7 },
          { name: 'GraphQL & REST APIs', category: 'Backend', level: 'Expert', order: 8 },
        ],
      },
      projects: {
        create: [
          {
            title: 'HyperMetrics Telemetry',
            tagline: 'Real-time observability platform for modern serverless apps',
            description: 'A lightning-fast developer observability tool with live trace visualizers, instant alerting, and zero-overhead instrumentation.',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
            tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
            liveUrl: 'https://hypermetrics-demo.vercel.app',
            githubUrl: 'https://github.com/example/hypermetrics',
            isFeatured: true,
            order: 1,
          },
          {
            title: 'DevVault Secure Secrets',
            tagline: 'Encrypted developer environment variable manager with team sync',
            description: 'End-to-end encrypted CLI and web dashboard for safely syncing environment keys across distributed engineering teams.',
            imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
            tags: ['React', 'Node.js', 'TypeScript', 'Cryptography', 'Redis'],
            liveUrl: 'https://devvault-demo.vercel.app',
            githubUrl: 'https://github.com/example/devvault',
            isFeatured: true,
            order: 2,
          },
          {
            title: 'SaaSify Design System',
            tagline: 'Accessible UI component library built for rapid SaaS prototyping',
            description: 'Over 50+ fully accessible, copy-paste React & Tailwind components with dark mode support and keyboard navigation.',
            imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
            tags: ['React', 'Tailwind CSS', 'Radix UI', 'Figma'],
            liveUrl: 'https://saasify-ui.vercel.app',
            githubUrl: 'https://github.com/example/saasify-ui',
            isFeatured: false,
            order: 3,
          },
        ],
      },
      certifications: {
        create: [
          {
            title: 'AWS Certified Solutions Architect - Professional',
            issuer: 'Amazon Web Services (AWS)',
            issueDate: new Date('2023-04-10'),
            expiryDate: new Date('2026-04-10'),
            credentialId: 'AWS-PSA-9482103',
            credentialUrl: 'https://aws.amazon.com/verification',
            order: 1,
          },
          {
            title: 'Meta Certified Senior Front-End Developer',
            issuer: 'Meta',
            issueDate: new Date('2022-08-15'),
            credentialId: 'META-FED-77291',
            credentialUrl: 'https://coursera.org/verify/meta',
            order: 2,
          },
        ],
      },
      testimonials: {
        create: [
          {
            name: 'Sarah Chen',
            role: 'VP of Engineering',
            company: 'Vercel Ecosystem Labs',
            quote: 'Alex is one of the most prolific engineers I have worked with. Their attention to performance and clean code architecture elevated our entire engineering culture.',
            avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
            order: 1,
          },
          {
            name: 'Marcus Vance',
            role: 'Principal Architect',
            company: 'CloudScale',
            quote: 'Alex delivered our telemetry service ahead of schedule and with zero production incidents. A stellar teammate and natural technical leader.',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
            order: 2,
          },
        ],
      },
    },
  });

  // 5. Create Demo User 2: Maya Lin (Creative & UI/UX Designer)
  const mayaUser = await prisma.user.create({
    data: {
      name: 'Maya Lin',
      email: 'maya.lin@example.com',
      passwordHash,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    },
  });

  await prisma.portfolio.create({
    data: {
      userId: mayaUser.id,
      slug: 'maya-lin',
      status: PortfolioStatus.PUBLISHED,
      publishedAt: new Date(),
      templateId: 'bold',
      accentColor: '#8b5cf6',
      fontFamily: 'Plus Jakarta Sans',
      seoTitle: 'Maya Lin | Senior Product & Brand Designer',
      seoDescription: 'Product Designer shaping joyful and intuitive digital experiences for startups and tech brands.',
      sectionOrder: ['about', 'projects', 'skills', 'experience', 'education', 'testimonials', 'contact'],
      profile: {
        create: {
          fullName: 'Maya Lin',
          headline: 'Senior Product Designer & Brand Strategist',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
          location: 'Brooklyn, New York',
          availableForHire: true,
          hireBadgeText: 'Taking on Q4 design projects',
        },
      },
      about: {
        create: {
          bio: 'I help tech companies turn complex ideas into clean, engaging, and human-centered digital products. With 5 years in agency and high-growth startup environments, I specialize in design systems, mobile apps, and visual identity.',
          keyHighlights: ['5+ Years Experience', '25+ Brand Identities', 'Figma Community Creator', 'Red Dot Design Nominee'],
        },
      },
      contactInfo: {
        create: {
          email: 'maya.lin@example.com',
          phone: '+1 (555) 987-6543',
          enableContactForm: true,
        },
      },
      socialLinks: {
        create: [
          { platform: 'dribbble', url: 'https://dribbble.com', order: 1 },
          { platform: 'linkedin', url: 'https://linkedin.com', order: 2 },
          { platform: 'twitter', url: 'https://x.com', order: 3 },
          { platform: 'instagram', url: 'https://instagram.com', order: 4 },
        ],
      },
      experiences: {
        create: [
          {
            company: 'Studio Pixel & Craft',
            companyUrl: 'https://example.com',
            position: 'Senior UI/UX Designer',
            employmentType: 'Full-time',
            location: 'New York, NY',
            startDate: new Date('2021-01-01'),
            isCurrent: true,
            description: 'Led end-to-end design sprints for 12+ SaaS clients. Built multi-brand design systems in Figma used by 40+ designers and developers.',
            order: 1,
          },
        ],
      },
      educations: {
        create: [
          {
            institution: 'Rhode Island School of Design (RISD)',
            degree: 'Bachelor of Fine Arts in Graphic Design',
            startDate: new Date('2016-09-01'),
            endDate: new Date('2020-05-30'),
            isCurrent: false,
            description: 'Graduated with Departmental Honors. Focus on Interaction Design and Typography.',
            order: 1,
          },
        ],
      },
      skills: {
        create: [
          { name: 'Figma & FigJam', category: 'Design Tools', level: 'Expert', order: 1 },
          { name: 'UI / UX Design', category: 'Design', level: 'Expert', order: 2 },
          { name: 'Design Systems', category: 'Design', level: 'Expert', order: 3 },
          { name: 'Prototyping & Motion', category: 'Design Tools', level: 'Advanced', order: 4 },
          { name: 'Design Tokens', category: 'Handoff', level: 'Advanced', order: 5 },
          { name: 'User Research', category: 'Strategy', level: 'Intermediate', order: 6 },
        ],
      },
      projects: {
        create: [
          {
            title: 'Lumina Fintech App',
            tagline: 'Next-generation mobile investment experience for Gen Z',
            description: 'Complete mobile banking & stock trading experience with micro-interactions, portfolio forecasting, and gamified saving pools.',
            imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
            tags: ['Figma', 'UI/UX', 'Mobile App', 'Fintech', 'Design System'],
            liveUrl: 'https://dribbble.com',
            isFeatured: true,
            order: 1,
          },
          {
            title: 'Nordic Furniture Branding',
            tagline: 'Minimalist e-commerce brand identity and catalog design',
            description: 'Crafted typography, packaging, and digital storefront UI for a Scandinavian sustainable furniture atelier.',
            imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
            tags: ['Branding', 'E-Commerce', 'Art Direction', 'Typography'],
            liveUrl: 'https://dribbble.com',
            isFeatured: true,
            order: 2,
          },
        ],
      },
      testimonials: {
        create: [
          {
            name: 'Elena Rostova',
            role: 'Product Lead',
            company: 'Lumina Financial',
            quote: 'Maya transformed our confusing complex app into a delightful, award-winning experience that boosted our onboarding conversion by 60%.',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
            order: 1,
          },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('   Demo Account 1: alex.rivera@example.com (Password: Password123!)');
  console.log('   Demo Account 2: maya.lin@example.com (Password: Password123!)');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
