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
  await page.waitForSelector('.porsche-canvas-container.is-ready', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const elInfo = await page.evaluate(() => {
    const el = document.elementFromPoint(200, 300);
    const textEls = Array.from(document.querySelectorAll('h1, p, span, button')).map(e => {
      const r = e.getBoundingClientRect();
      const s = window.getComputedStyle(e);
      return {
        tag: e.tagName,
        class: e.className,
        text: e.textContent.slice(0, 30),
        color: s.color,
        opacity: s.opacity,
        visibility: s.visibility,
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height
      };
    }).filter(e => e.text.includes('ENGINEERING') || e.text.includes('AKASH') || e.text.includes('DISCIPLINE'));
    return {
      elementFromPoint200_300: el ? { tag: el.tagName, className: el.className } : null,
      textEls
    };
  });

  console.log(JSON.stringify(elInfo, null, 2));
  await browser.close();
})();
