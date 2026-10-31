import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('LOG:', msg.text()));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.porsche-canvas-container.is-ready', { timeout: 30000 });

  const info = await page.evaluate(() => {
    // We can inspect the canvas or window objects if exposed, or let's inspect the loaded scene
    return {
      title: document.title,
    };
  });

  console.log('Page loaded:', info);
  await browser.close();
})();
