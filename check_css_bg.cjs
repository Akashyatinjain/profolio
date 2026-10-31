const puppeteer = require('./node_modules/puppeteer-core');
const fs = require('fs');

const possiblePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
let executablePath = possiblePaths.find(p => fs.existsSync(p));

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });

  // Hide the canvas and take a screenshot of CSS background
  await page.evaluate(() => {
    const canvasContainer = document.querySelector('.porsche-canvas-container');
    if (canvasContainer) canvasContainer.style.display = 'none';
  });

  await page.screenshot({ path: 'C:/Users/Akash/.gemini/antigravity-ide/brain/f8540bce-d12d-4be2-8511-97fe42b16696/css_only_background.png' });
  console.log('CSS only screenshot taken');
  await browser.close();
})();
