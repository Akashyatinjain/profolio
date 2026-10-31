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

  const lightObjects = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    const res = [];
    scene.traverse(obj => {
      if (obj.isMesh && (obj.name.toLowerCase().includes('circle') || obj.name.toLowerCase().includes('cube') || obj.name.toLowerCase().includes('plane'))) {
        const mat = obj.material;
        const matName = mat ? (mat.name || '') : '';
        if (matName.includes('light') || matName.includes('refraction') || obj.name.includes('Circle017') || obj.name.includes('Circle011') || obj.name.includes('Circle008') || obj.name.includes('Circle006')) {
          const worldPos = new THREE.Vector3();
          obj.getWorldPosition(worldPos);
          res.push({
            name: obj.name,
            matName,
            color: mat.color ? '#' + mat.color.getHexString() : null,
            emissive: mat.emissive ? '#' + mat.emissive.getHexString() : null,
            hasMap: !!mat.map,
            worldPos: { x: +worldPos.x.toFixed(2), y: +worldPos.y.toFixed(2), z: +worldPos.z.toFixed(2) }
          });
        }
      }
    });
    return res;
  });

  console.log('LIGHT OBJECTS IN SCENE:');
  console.log(JSON.stringify(lightObjects, null, 2));
  await browser.close();
})();
