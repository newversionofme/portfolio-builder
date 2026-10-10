import puppeteer from 'puppeteer';
import path from 'path';

async function captureScreenshots() {
  console.log('🚀 Launching browser automation...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const artifactDir = '/Users/evasitinurjanah/.gemini/antigravity/brain/62c7b71f-a25f-4f59-b5d3-030d664fbe55';

  // 1. Capture Landing Page
  console.log('📸 Navigating to Landing Page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_landing.png') });
  console.log('✅ Captured screenshot_landing.png');

  // 2. Capture Login Page
  console.log('📸 Navigating to /login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_login.png') });
  console.log('✅ Captured screenshot_login.png');

  // 3. Perform Login by clicking Demo Quick Fill
  console.log('🔑 Clicking Dev Demo Fill button for Alex...');
  // Find button with text 'Alex (Developer)'
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Alex (Developer)')) {
      await btn.click();
      break;
    }
  }

  // Click submit button
  console.log('🚀 Submitting login form...');
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
  }

  // Wait for redirect to dashboard
  console.log('⏳ Waiting for dashboard redirect...');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_dashboard.png') });
  console.log('✅ Captured screenshot_dashboard.png');

  // 4. Navigate to Editor
  console.log('🎨 Navigating to /dashboard/editor...');
  await page.goto('http://localhost:3000/dashboard/editor', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 2000)); // Wait for live preview to render
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_editor.png') });
  console.log('✅ Captured screenshot_editor.png');

  // 5. Also capture public page
  console.log('🌐 Navigating to /u/alex-rivera...');
  await page.goto('http://localhost:3000/u/alex-rivera', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_public_portfolio.png') });
  console.log('✅ Captured screenshot_public_portfolio.png');

  await browser.close();
  console.log('🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

captureScreenshots().catch((err) => {
  console.error('❌ Browser capture error:', err);
  process.exit(1);
});
