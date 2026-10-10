import puppeteer from 'puppeteer';
import path from 'path';

async function captureEditorStyled() {
  const artifactDir = '/Users/evasitinurjanah/.gemini/antigravity/brain/62c7b71f-a25f-4f59-b5d3-030d664fbe55';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.type('#email', 'alex.rivera@example.com');
  await page.type('#password', 'Password123!');
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => window.location.pathname.includes('/dashboard'), { timeout: 15000 });
  await page.goto('http://localhost:3000/dashboard/editor', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const editorScreenshot = path.join(artifactDir, 'screenshot_editor_styled.png');
  await page.screenshot({ path: editorScreenshot, fullPage: false });
  console.log('✅ Captured Editor Styled screenshot:', editorScreenshot);

  await browser.close();
}

captureEditorStyled().catch(console.error);
