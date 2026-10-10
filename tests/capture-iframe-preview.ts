import puppeteer from 'puppeteer';
import path from 'path';

async function captureIframePreview() {
  const artifactDir = '/Users/evasitinurjanah/.gemini/antigravity/brain/62c7b71f-a25f-4f59-b5d3-030d664fbe55';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Logging in...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.type('#email', 'alex.rivera@example.com');
  await page.type('#password', 'Password123!');
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => window.location.pathname.includes('/dashboard'), { timeout: 15000 });
  console.log('Navigating to Editor...');
  await page.goto('http://localhost:3000/dashboard/editor', { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait for editor & iframe to be ready
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Desktop Preview Screenshot
  console.log('Capturing Desktop Preview...');
  await page.click('button[title="Tampilan Desktop"]');
  await new Promise((r) => setTimeout(r, 1000));
  const desktopScreenshot = path.join(artifactDir, 'screenshot_preview_desktop.png');
  await page.screenshot({ path: desktopScreenshot, fullPage: false });
  console.log('✅ Captured Desktop Preview:', desktopScreenshot);

  // 2. Tablet Preview Screenshot
  console.log('Capturing Tablet Preview (768px)...');
  await page.click('button[title="Tampilan Tablet (768px)"]');
  await new Promise((r) => setTimeout(r, 1000));
  const tabletScreenshot = path.join(artifactDir, 'screenshot_preview_tablet.png');
  await page.screenshot({ path: tabletScreenshot, fullPage: false });
  console.log('✅ Captured Tablet Preview:', tabletScreenshot);

  // 3. Mobile Preview Screenshot
  console.log('Capturing Mobile Preview (375px)...');
  await page.click('button[title="Tampilan Mobile (375px)"]');
  await new Promise((r) => setTimeout(r, 1000));
  const mobileScreenshot = path.join(artifactDir, 'screenshot_preview_mobile.png');
  await page.screenshot({ path: mobileScreenshot, fullPage: false });
  console.log('✅ Captured Mobile Preview:', mobileScreenshot);

  // 4. Public Mobile Page (/u/alex-rivera at 375px)
  console.log('Capturing Public Page /u/alex-rivera at 375px...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 812 });
  await mobilePage.goto('http://localhost:3000/u/alex-rivera', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));
  const publicMobileScreenshot = path.join(artifactDir, 'screenshot_public_mobile_375.png');
  await mobilePage.screenshot({ path: publicMobileScreenshot, fullPage: false });
  console.log('✅ Captured Public Mobile 375px:', publicMobileScreenshot);

  await browser.close();
  console.log('All screenshots captured successfully!');
}

captureIframePreview().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
