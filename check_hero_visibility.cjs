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

  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('.hero-section');
    const headline = document.querySelector('.hero-headline');
    const container = document.querySelector('.hero-container');
    const canvas = document.querySelector('.porsche-canvas-container');
    const getStyles = el => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        display: s.display,
        visibility: s.visibility,
        opacity: s.opacity,
        zIndex: s.zIndex,
        rect: { top: r.top, left: r.left, width: r.width, height: r.height }
      };
    };
    return {
      hero: getStyles(hero),
      headline: getStyles(headline),
      container: getStyles(container),
      canvas: getStyles(canvas)
    };
  });

  console.log('HERO INFO:', JSON.stringify(heroInfo, null, 2));
  await browser.close();
})();
