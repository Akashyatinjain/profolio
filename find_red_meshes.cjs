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

  const redMeshes = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    const list = [];
    scene.traverse(obj => {
      if (obj.isMesh && obj.visible && obj.material) {
        const hex = obj.material.color ? obj.material.color.getHexString() : '';
        const em = obj.material.emissive ? obj.material.emissive.getHexString() : '';
        if (hex.toLowerCase().startsWith('99') || hex.toLowerCase().startsWith('aa') || em.toLowerCase().startsWith('aa')) {
          const worldBox = new THREE.Box3().setFromObject(obj);
          list.push({
            name: obj.name,
            matName: obj.material.name,
            color: hex,
            emissive: em,
            boxMin: worldBox.min,
            boxMax: worldBox.max
          });
        }
      }
    });
    return list;
  });

  console.log('RED MESHES:');
  console.log(JSON.stringify(redMeshes, null, 2));
  await browser.close();
})();
