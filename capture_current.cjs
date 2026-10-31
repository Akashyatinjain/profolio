const puppeteer = require('./node_modules/puppeteer-core');
const fs = require('fs');

const possiblePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

let executablePath = possiblePaths.find(p => fs.existsSync(p));

(async () => {
  if (!executablePath) {
    console.error('No browser executable found!');
    return;
  }
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.porsche-canvas-container.is-ready', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const outPath = 'C:/Users/Akash/.gemini/antigravity-ide/brain/f8540bce-d12d-4be2-8511-97fe42b16696/current_hero_state.png';
  await page.screenshot({ path: outPath });
  console.log('Hero screenshot captured successfully to', outPath);
  await browser.close();
})();
