import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { PortfolioStatus } from '@prisma/client';

async function verifyEndToEnd() {
  console.log('🧪 Starting automated End-to-End integration test...');

  const timestamp = Date.now();
  const testEmail = `tester.${timestamp}@example.com`;
  const testSlug = `tester-slug-${timestamp}`;
  const rawPassword = 'Password123!';

  // 1. Test Registration
  console.log('1️⃣ Testing user registration and portfolio stub creation...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  const createdUser = await prisma.user.create({
    data: {
      name: 'Integration Tester',
      email: testEmail,
      passwordHash,
      portfolio: {
        create: {
          slug: testSlug,
          status: PortfolioStatus.PUBLISHED,
          publishedAt: new Date(),
          templateId: 'minimalist',
          accentColor: '#2563eb',
          fontFamily: 'Inter',
          profile: {
            create: {
              fullName: 'Integration Tester',
              headline: 'QA Specialist',
              location: 'Jakarta, Indonesia',
              availableForHire: true,
              hireBadgeText: 'Ready for full-time roles',
            },
          },
          about: {
            create: {
              bio: 'Experienced in automated testing and Next.js 15 architectures.',
              keyHighlights: ['Automated Testing', 'PostgreSQL Expert'],
            },
          },
          contactInfo: {
            create: {
              email: testEmail,
              phone: '+62 811 2233 4455',
              enableContactForm: true,
            },
          },
          socialLinks: {
            create: [
              { platform: 'github', url: 'https://github.com/tester', order: 0 },
            ],
          },
          skills: {
            create: [
              { name: 'TypeScript', category: 'Languages', level: 'Expert', order: 0 },
            ],
          },
          projects: {
            create: [
              {
                title: 'E2E Testing Harness',
                tagline: 'High-speed automated testing framework',
                description: 'Framework capable of validating endpoints in under 30 seconds.',
                tags: ['TypeScript', 'Node.js'],
                liveUrl: 'https://example.com/demo',
                githubUrl: 'https://github.com/example/e2e-harness',
                isFeatured: true,
                order: 0,
              },
            ],
          },
        },
      },
    },
    include: {
      portfolio: {
        include: {
          profile: true,
          about: true,
          contactInfo: true,
          socialLinks: true,
          skills: true,
          projects: true,
        },
      },
    },
  });

  console.log('✅ User registered successfully. User ID:', createdUser.id);
  console.log('   Portfolio slug:', createdUser.portfolio?.slug);

  // 2. Test Public Route HTTP Status
  console.log('2️⃣ Verifying public HTTP response for slug:', testSlug);
  const response = await fetch(`http://localhost:3000/u/${testSlug}`);
  const html = await response.text();

  if (response.status === 200 && html.includes('Integration Tester')) {
    console.log('✅ Public portfolio page rendered with HTTP 200 OK and expected content!');
  } else {
    throw new Error(`Public page verification failed with status ${response.status}`);
  }

  // 3. Cleanup test user
  console.log('3️⃣ Cleaning up test artifacts...');
  await prisma.user.delete({ where: { id: createdUser.id } });
  console.log('✅ Cleanup completed.');

  console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
}

verifyEndToEnd()
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
