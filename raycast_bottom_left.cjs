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
  await page.waitForFunction(() => window.__scene && window.__THREE);

  const hit = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    const camera = new THREE.PerspectiveCamera(26, 1440 / 900, 0.1, 100);
    camera.position.set(0, 0.95, 11.2);
    camera.lookAt(0, 0.65, 0);
    camera.updateMatrixWorld(true);

    const raycaster = new THREE.Raycaster();
    // At bottom left (100, 750):
    raycaster.setFromCamera(new THREE.Vector2((100 / 1440) * 2 - 1, -(750 / 900) * 2 + 1), camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    return intersects.map(i => ({
      name: i.object.name,
      distance: i.distance,
      point: i.point,
      mat: i.object.material ? {
        color: i.object.material.color ? i.object.material.color.getHexString() : null,
        transparent: i.object.material.transparent,
        opacity: i.object.material.opacity,
        type: i.object.material.type
      } : null
    }));
  });

  console.log('RAYCAST AT (100, 750):', JSON.stringify(hit, null, 2));
  await browser.close();
})();
