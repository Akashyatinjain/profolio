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

  const hit = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    if (!scene || !THREE) return 'No scene';
    
    // Camera is at (0, 0.95, 11.2) looking at (0, 0.65, 0)
    const camera = new THREE.PerspectiveCamera(26, 1440 / 900, 0.1, 100);
    camera.position.set(0, 0.95, 11.2);
    camera.lookAt(0, 0.65, 0);
    camera.updateMatrixWorld(true);

    const raycaster = new THREE.Raycaster();
    // Normalized device coords for (1200, 450):
    // x = (1200 / 1440) * 2 - 1 = 0.6667
    // y = -(450 / 900) * 2 + 1 = 0.0
    raycaster.setFromCamera(new THREE.Vector2(0.6667, 0.0), camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    return intersects.map(i => ({
      name: i.object.name,
      parent: i.object.parent ? i.object.parent.name : null,
      distance: i.distance,
      point: i.point,
      mat: i.object.material ? {
        name: i.object.material.name,
        color: i.object.material.color ? i.object.material.color.getHexString() : null,
        roughness: i.object.material.roughness,
        metalness: i.object.material.metalness,
        transparent: i.object.material.transparent,
        opacity: i.object.material.opacity,
        type: i.object.material.type
      } : null
    }));
  });

  console.log('RAYCAST HIT AT (1200, 450):', JSON.stringify(hit, null, 2));
  await browser.close();
})();
