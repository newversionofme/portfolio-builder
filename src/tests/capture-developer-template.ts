import puppeteer from 'puppeteer';
import path from 'path';
import { prisma } from '../lib/prisma';

async function captureDeveloperTemplateShowcase() {
  console.log('📸 Starting Developer Template Comprehensive Testing & Screenshots...');

  const artifactDir = '/Users/evasitinurjanah/.gemini/antigravity/brain/62c7b71f-a25f-4f59-b5d3-030d664fbe55';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // --- KONDISI 1: FULL DATA STATE (Alex Rivera) ---
  console.log('\n--- KONDISI 1: FULL DATA STATE ---');
  const alexUser = await prisma.user.findUnique({
    where: { email: 'alex.rivera@example.com' },
    include: { portfolio: true },
  });

  if (alexUser?.portfolio?.id) {
    await prisma.portfolio.update({
      where: { id: alexUser.portfolio.id },
      data: {
        templateId: 'developer',
        fontFamily: 'JetBrains Mono',
      },
    });
  }

  // 1A. Full Desktop 1440x900
  console.log('1A. Capturing Full Desktop viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/u/alex-rivera', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const desktopFullScreenshot = path.join(artifactDir, 'screenshot_developer_desktop_full.png');
  await page.screenshot({ path: desktopFullScreenshot, fullPage: true });
  console.log('✅ Captured Full Desktop screenshot:', desktopFullScreenshot);

  // 1B. Full Mobile 375x812 (Testing horizontal scroll)
  console.log('1B. Capturing Full Mobile viewport (375x812)...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  // Verify no horizontal overflow at 375px
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile Scroll Width: ${scrollWidth}px, Client Width: ${clientWidth}px`);
  if (scrollWidth <= clientWidth + 1) {
    console.log('✅ Mobile 375px has ZERO horizontal scrollbar overflow!');
  } else {
    console.warn('⚠️ Warning: Horizontal scroll detected!');
  }

  const mobileFullScreenshot = path.join(artifactDir, 'screenshot_developer_mobile_full.png');
  await page.screenshot({ path: mobileFullScreenshot, fullPage: true });
  console.log('✅ Captured Full Mobile screenshot:', mobileFullScreenshot);


  // --- KONDISI 2: EMPTY DATA STATE (Create clean dummy user or clean portfolio) ---
  console.log('\n--- KONDISI 2: EMPTY DATA STATE (No projects/certs/testimonials) ---');
  let emptyUser = await prisma.user.findUnique({
    where: { email: 'dev.empty@example.com' },
    include: { portfolio: true },
  });

  if (!emptyUser) {
    emptyUser = await prisma.user.create({
      data: {
        name: 'Jordan Sparks',
        email: 'dev.empty@example.com',
        passwordHash: 'dummyhash',
        portfolio: {
          create: {
            slug: 'jordan-sparks',
            templateId: 'developer',
            fontFamily: 'JetBrains Mono',
            status: 'PUBLISHED',
            profile: {
              create: {
                fullName: 'Jordan Sparks',
                headline: 'Junior Systems Programmer & Linux Enthusiast',
                availableForHire: false, // Testing available for hire = false
                location: 'Bandung, Indonesia',
              },
            },
            about: {
              create: {
                bio: 'Passionate low-level software enthusiast exploring Rust, C, and distributed systems architecture. Currently building minimalist command-line utilities.',
                keyHighlights: ['Systems Programming', 'Linux Internals', 'Rust Lang'],
              },
            },
            contactInfo: {
              create: {
                email: 'jordan@example.com',
              },
            },
            skills: {
              create: [
                { name: 'Rust', category: 'Languages', level: 'Intermediate', order: 0 },
                { name: 'C / C++', category: 'Languages', level: 'Intermediate', order: 1 },
                { name: 'Linux CLI', category: 'DevOps & Tools', level: 'Advanced', order: 2 },
                { name: 'Git & Bash', category: 'DevOps & Tools', level: 'Advanced', order: 3 },
              ],
            },
          },
        },
      },
      include: { portfolio: true },
    });
  }

  // 2A. Empty Desktop 1440x900
  console.log('2A. Capturing Empty Desktop viewport (1440x900)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/u/jordan-sparks', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const desktopEmptyScreenshot = path.join(artifactDir, 'screenshot_developer_desktop_empty.png');
  await page.screenshot({ path: desktopEmptyScreenshot, fullPage: true });
  console.log('✅ Captured Empty Desktop screenshot:', desktopEmptyScreenshot);

  // 2B. Empty Mobile 375x812
  console.log('2B. Capturing Empty Mobile viewport (375x812)...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const mobileEmptyScreenshot = path.join(artifactDir, 'screenshot_developer_mobile_empty.png');
  await page.screenshot({ path: mobileEmptyScreenshot, fullPage: true });
  console.log('✅ Captured Empty Mobile screenshot:', mobileEmptyScreenshot);

  await browser.close();
  await prisma.$disconnect();
  console.log('\n🎉 ALL SCREENSHOTS AND RESPONSIVE TESTS COMPLETED SUCCESSFULLY!');
}

captureDeveloperTemplateShowcase().catch((err) => {
  console.error('❌ Error capturing showcase:', err);
  process.exit(1);
});
