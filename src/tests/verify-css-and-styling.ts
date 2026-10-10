import puppeteer from 'puppeteer';
import path from 'path';

async function verifyCssAndStyling() {
  console.log('🔍 Verifying CSS and Tailwind Styling in Dev Server...');

  const artifactDir = '/Users/evasitinurjanah/.gemini/antigravity/brain/62c7b71f-a25f-4f59-b5d3-030d664fbe55';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Check Landing Page
  console.log('1. Navigating to Landing Page http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const landingBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log('Landing body computed background color:', landingBg);

  const landingScreenshot = path.join(artifactDir, 'screenshot_landing_styled.png');
  await page.screenshot({ path: landingScreenshot, fullPage: false });
  console.log('✅ Captured Landing Page screenshot:', landingScreenshot);

  // 2. Check Login Page
  console.log('2. Navigating to Login Page http://localhost:3000/login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const loginScreenshot = path.join(artifactDir, 'screenshot_login_styled.png');
  await page.screenshot({ path: loginScreenshot, fullPage: false });
  console.log('✅ Captured Login Page screenshot:', loginScreenshot);

  // 3. Check Developer Template on /u/alex-rivera
  console.log('3. Navigating to Developer Template http://localhost:3000/u/alex-rivera...');
  await page.goto('http://localhost:3000/u/alex-rivera', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const devTemplateBg = await page.evaluate(() => {
    const el = document.querySelector('main');
    return el ? window.getComputedStyle(el).backgroundColor : null;
  });
  console.log('Developer template computed background:', devTemplateBg);

  const devTemplateScreenshot = path.join(artifactDir, 'screenshot_developer_template_styled.png');
  await page.screenshot({ path: devTemplateScreenshot, fullPage: false });
  console.log('✅ Captured Developer Template screenshot:', devTemplateScreenshot);

  await browser.close();
  console.log('🎉 CSS & Styling Verification Completed Successfully!');
}

verifyCssAndStyling().catch((err) => {
  console.error('❌ Error verifying CSS:', err);
  process.exit(1);
});
