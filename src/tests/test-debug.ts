import puppeteer from 'puppeteer';

async function testDebug() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });

  // Type directly into email and password
  await page.waitForSelector('#email');
  await page.type('#email', 'alex.rivera@example.com');
  await page.type('#password', 'Password123!');
  console.log('Filled credentials');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]'),
  ]);

  console.log('After submit URL:', page.url());

  await page.goto('http://localhost:3000/dashboard/editor', { waitUntil: 'networkidle2' });
  console.log('Editor page URL:', page.url());

  const html = await page.content();
  console.log('Page Title:', await page.title());
  console.log('Has #headline:', html.includes('id="headline"'));
  if (!html.includes('id="headline"')) {
    console.log('HTML snippet:', html.slice(0, 1000));
  }

  await browser.close();
}

testDebug().catch((err) => {
  console.error('Debug error:', err);
  process.exit(1);
});
