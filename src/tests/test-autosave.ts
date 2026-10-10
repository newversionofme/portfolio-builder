import puppeteer from 'puppeteer';
import path from 'path';

async function testAutosaveFlow() {
  console.log('🚀 Starting Autosave E2E Verification Test...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const artifactDir = '/Users/evasitinurjanah/.gemini/antigravity/brain/62c7b71f-a25f-4f59-b5d3-030d664fbe55';
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => console.log('BROWSER CONSOLE:', msg.text()));

  // 1. Navigate to /login
  console.log('1. Navigating to /login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button[type="submit"]', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1000));

  // 2. Fill login form
  console.log('2. Filling credentials for Alex Rivera...');
  await page.waitForSelector('#email');
  await page.type('#email', 'alex.rivera@example.com', { delay: 10 });
  await page.type('#password', 'Password123!', { delay: 10 });

  // 3. Submit and wait for redirect to dashboard
  console.log('3. Submitting login form...');
  await page.click('button[type="submit"]');
  console.log('4. Waiting for redirect to dashboard or navigation...');
  await page.waitForFunction(
    () => window.location.pathname.includes('/dashboard'),
    { timeout: 20000 }
  );

  console.log('5. Successfully reached dashboard URL:', page.url());

  // 4. Navigate to Editor
  console.log('5. Navigating to /dashboard/editor...');
  await page.goto('http://localhost:3000/dashboard/editor', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('#headline', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const initialHeadline = await page.$eval('#headline', (el) => (el as HTMLInputElement).value);
  const initialLocation = await page.$eval('#location', (el) => (el as HTMLInputElement).value);
  console.log('Initial headline in Editor:', initialHeadline);
  console.log('Initial location in Editor:', initialLocation);

  // 5. Edit headline
  const testHeadline = 'Principal Software Architect & Lead Full-Stack Engineer';
  console.log('6. Modifying headline to:', testHeadline);
  await page.evaluate((val) => {
    const input = document.querySelector('#headline') as HTMLInputElement;
    if (!input) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, val);
    } else {
      input.value = val;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, testHeadline);

  const currentHeadlineInInput = await page.$eval('#headline', (el) => (el as HTMLInputElement).value);
  console.log('Input value right after typing headline:', currentHeadlineInInput);

  // 6. Edit location
  const testLocation = 'Jakarta & Bandung, Indonesia (Remote)';
  console.log('7. Modifying location to:', testLocation);
  await page.evaluate((val) => {
    const input = document.querySelector('#location') as HTMLInputElement;
    if (!input) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, val);
    } else {
      input.value = val;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, testLocation);

  const currentLocationInInput = await page.$eval('#location', (el) => (el as HTMLInputElement).value);
  console.log('Input value right after typing location:', currentLocationInInput);

  // 7. Wait for debounced autosave to trigger and complete (1.2s debounce + DB transaction)
  console.log('8. Waiting 4.5 seconds for debounced autosave to execute and save...');
  await new Promise((r) => setTimeout(r, 4500));

  // Check header save indicator
  const headerText = await page.$eval('header', (el) => el.textContent);
  console.log('Header status after autosave:', headerText);

  // Capture screenshot 1: Saved state in editor
  const savedScreenshotPath = path.join(artifactDir, 'screenshot_autosave_saved.png');
  await page.screenshot({ path: savedScreenshotPath, fullPage: false });
  console.log('✅ Captured screenshot 1 (Autosave Saved):', savedScreenshotPath);

  // 8. Refresh page to verify persistence
  console.log('9. Reloading page to verify database persistence...');
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('#headline', { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1000));

  const refreshedHeadline = await page.$eval('#headline', (el) => (el as HTMLInputElement).value);
  const refreshedLocation = await page.$eval('#location', (el) => (el as HTMLInputElement).value);
  console.log('Refreshed headline in DOM:', refreshedHeadline);
  console.log('Refreshed location in DOM:', refreshedLocation);

  // Capture screenshot 2: After refresh state
  const refreshedScreenshotPath = path.join(artifactDir, 'screenshot_after_refresh.png');
  await page.screenshot({ path: refreshedScreenshotPath, fullPage: false });
  console.log('✅ Captured screenshot 2 (After Refresh):', refreshedScreenshotPath);

  if (refreshedHeadline === testHeadline && refreshedLocation === testLocation) {
    console.log('🎉 VERIFICATION COMPLETE: Autosave saved successfully and data persisted 100% across page reload!');
  } else {
    console.error('❌ VERIFICATION FAILED: Data did not match expected values.');
    process.exit(1);
  }

  await browser.close();
}

testAutosaveFlow().catch((err) => {
  console.error('❌ Test error:', err);
  process.exit(1);
});
