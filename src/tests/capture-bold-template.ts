import puppeteer from 'puppeteer';
import path from 'path';
import { prisma } from '../lib/prisma';

async function captureBoldTemplateShowcase() {
  console.log('🎨 Starting Bold/Creative Template Comprehensive Testing & Screenshots...');

  const artifactDir = '/Users/evasitinurjanah/.gemini/antigravity/brain/62c7b71f-a25f-4f59-b5d3-030d664fbe55';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // ========================================================
  // KONDISI 1: FULL DATA STATE (Alex Rivera)
  // ========================================================
  console.log('\n--- KONDISI 1: FULL DATA STATE ---');
  const alexUser = await prisma.user.findUnique({
    where: { email: 'alex.rivera@example.com' },
    include: { portfolio: true },
  });

  if (alexUser?.portfolio?.id) {
    await prisma.portfolio.update({
      where: { id: alexUser.portfolio.id },
      data: {
        templateId: 'bold',
        accentColor: '#7c3aed',
        fontFamily: 'Plus Jakarta Sans',
      },
    });
    console.log('Updated Alex Rivera portfolio to templateId: bold, accentColor: #7c3aed');
  }

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  // 1A. Login to Editor & Capture Live Preview (Desktop, Tablet, Mobile)
  console.log('1A. Logging into Editor via 1-Click Demo Button...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  // Find and click Alex demo button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Alex')) {
      console.log('Clicking demo button for Alex Rivera...');
      await btn.click();
      break;
    }
  }

  console.log('Waiting for redirect to /dashboard...');
  await page.waitForFunction(
    () => window.location.pathname.includes('/dashboard'),
    { timeout: 20000 }
  );

  console.log('Reached dashboard! Now navigating to /dashboard/editor...');
  await page.goto('http://localhost:3000/dashboard/editor', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForSelector('button[title="Tampilan Desktop"]', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  // Capture Editor Preview Desktop
  console.log('Capturing Editor Preview Desktop...');
  await page.click('button[title="Tampilan Desktop"]');
  await new Promise((r) => setTimeout(r, 1200));
  const previewDesktopScreenshot = path.join(artifactDir, 'screenshot_bold_preview_desktop.png');
  await page.screenshot({ path: previewDesktopScreenshot, fullPage: false });
  console.log('✅ Captured Editor Preview Desktop:', previewDesktopScreenshot);

  // Capture Editor Preview Tablet (768px)
  console.log('Capturing Editor Preview Tablet (768px)...');
  await page.click('button[title="Tampilan Tablet (768px)"]');
  await new Promise((r) => setTimeout(r, 1200));
  const previewTabletScreenshot = path.join(artifactDir, 'screenshot_bold_preview_tablet.png');
  await page.screenshot({ path: previewTabletScreenshot, fullPage: false });
  console.log('✅ Captured Editor Preview Tablet:', previewTabletScreenshot);

  // Capture Editor Preview Mobile (375px)
  console.log('Capturing Editor Preview Mobile (375px)...');
  await page.click('button[title="Tampilan Mobile (375px)"]');
  await new Promise((r) => setTimeout(r, 1200));
  const previewMobileScreenshot = path.join(artifactDir, 'screenshot_bold_preview_mobile.png');
  await page.screenshot({ path: previewMobileScreenshot, fullPage: false });
  console.log('✅ Captured Editor Preview Mobile:', previewMobileScreenshot);

  // 1B. Public Full Desktop (1440x900)
  console.log('\n1B. Capturing Public Page Full Desktop (/u/alex-rivera)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/u/alex-rivera', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));
  const desktopFullScreenshot = path.join(artifactDir, 'screenshot_bold_desktop_full.png');
  await page.screenshot({ path: desktopFullScreenshot, fullPage: true });
  console.log('✅ Captured Public Full Desktop:', desktopFullScreenshot);

  // 1C. Public Full Mobile (375x812)
  console.log('1C. Capturing Public Page Full Mobile 375px...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  // Check overflow at 375px
  const fullMobileScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(`📏 Full Mobile Document Scroll Width: ${fullMobileScrollWidth}px (Target <= 375px)`);
  if (fullMobileScrollWidth > 375) {
    console.warn(`⚠️ Warning: Mobile page has horizontal scroll! width = ${fullMobileScrollWidth}`);
  } else {
    console.log('✅ Perfect: No horizontal overflow at 375px!');
  }

  const mobileFullScreenshot = path.join(artifactDir, 'screenshot_bold_mobile_full.png');
  await page.screenshot({ path: mobileFullScreenshot, fullPage: true });
  console.log('✅ Captured Public Full Mobile:', mobileFullScreenshot);

  // ========================================================
  // KONDISI 2: EMPTY DATA STATE (Demo Minimal / Kosong)
  // ========================================================
  console.log('\n--- KONDISI 2: EMPTY DATA STATE ---');
  let emptyUser = await prisma.user.findUnique({
    where: { email: 'bold.empty@example.com' },
    include: { portfolio: true },
  });

  if (!emptyUser) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    emptyUser = await prisma.user.create({
      data: {
        email: 'bold.empty@example.com',
        passwordHash: hashedPassword,
        name: 'Jordan Hayes',
        portfolio: {
          create: {
            slug: 'jordan-hayes',
            status: 'PUBLISHED',
            templateId: 'bold',
            accentColor: '#e11d48',
            fontFamily: 'Plus Jakarta Sans',
            profile: {
              create: {
                fullName: 'Jordan Hayes',
                headline: 'Art Director & Brand Stylist',
                location: 'Tokyo, Japan',
                availableForHire: false,
                hireBadgeText: null,
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
              },
            },
            about: {
              create: {
                bio: 'Creating distinctive visual identities and digital worlds that bridge culture and technology.',
                keyHighlights: ['Brand Systems', 'Motion Direction', 'Spatial Design'],
              },
            },
            contactInfo: {
              create: {
                email: 'jordan@hayes.design',
                whatsapp: '+819012345678',
                enableContactForm: true,
              },
            },
            socialLinks: {
              create: [
                { platform: 'dribbble', url: 'https://dribbble.com', order: 0 },
                { platform: 'instagram', url: 'https://instagram.com', order: 1 },
              ],
            },
          },
        },
      },
      include: { portfolio: true },
    });
    console.log('Created empty test user: bold.empty@example.com (slug: jordan-hayes)');
  } else if (emptyUser.portfolio?.id) {
    await prisma.portfolio.update({
      where: { id: emptyUser.portfolio.id },
      data: {
        templateId: 'bold',
        accentColor: '#e11d48',
        fontFamily: 'Plus Jakarta Sans',
      },
    });
    console.log('Reset empty test portfolio for Jordan Hayes');
  }

  // 2A. Empty Desktop (1440x900)
  console.log('2A. Capturing Empty State Desktop (/u/jordan-hayes)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/u/jordan-hayes', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  const desktopEmptyScreenshot = path.join(artifactDir, 'screenshot_bold_desktop_empty.png');
  await page.screenshot({ path: desktopEmptyScreenshot, fullPage: true });
  console.log('✅ Captured Empty State Desktop:', desktopEmptyScreenshot);

  // 2B. Empty Mobile (375x812)
  console.log('2B. Capturing Empty State Mobile 375px...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  const emptyMobileScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(`📏 Empty Mobile Document Scroll Width: ${emptyMobileScrollWidth}px (Target <= 375px)`);

  const mobileEmptyScreenshot = path.join(artifactDir, 'screenshot_bold_mobile_empty.png');
  await page.screenshot({ path: mobileEmptyScreenshot, fullPage: true });
  console.log('✅ Captured Empty State Mobile:', mobileEmptyScreenshot);

  await browser.close();
  console.log('\n🎉 ALL BOLD TEMPLATE SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

captureBoldTemplateShowcase().catch((err) => {
  console.error('❌ Error executing capture script:', err);
  process.exit(1);
});
