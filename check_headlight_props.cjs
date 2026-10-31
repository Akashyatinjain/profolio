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
  await new Promise(r => setTimeout(r, 1000));

  const headInfo = await page.evaluate(() => {
    const scene = window.__scene;
    const res = [];
    scene.traverse(obj => {
      if (obj.isMesh && (obj.name.includes('Circle017') || obj.name.includes('Circle011') || obj.name.includes('Circle008') || obj.name.includes('Circle016') || obj.name.includes('Circle013') || obj.name.includes('Circle034') || obj.name.includes('Circle031'))) {
        res.push({
          name: obj.name,
          visible: obj.visible,
          matName: obj.material ? obj.material.name : null,
          hasMap: !!(obj.material && obj.material.map),
          color: obj.material && obj.material.color ? obj.material.color.getHexString() : null,
          emissive: obj.material && obj.material.emissive ? obj.material.emissive.getHexString() : null,
          emissiveIntensity: obj.material ? obj.material.emissiveIntensity : null,
          roughness: obj.material ? obj.material.roughness : null,
          metalness: obj.material ? obj.material.metalness : null
        });
      }
    });
    return res;
  });

  console.log(JSON.stringify(headInfo, null, 2));
  await browser.close();
})();
