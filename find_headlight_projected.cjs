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

  const projectedMeshes = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    // Find the active camera
    let cam = null;
    // We can get camera from scene or let's create a temp camera with identical settings
    const camera = new THREE.PerspectiveCamera(26, 1440 / 900, 0.1, 100);
    camera.position.set(0, 0.95, 11.2);
    camera.lookAt(0, 0.65, 0);
    camera.updateMatrixWorld(true);

    const list = [];
    scene.traverse(obj => {
      if (obj.isMesh && obj.visible) {
        const box = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box.getCenter(center);
        
        // Project center to 2D screen
        const p = center.clone().project(camera);
        const screenX = (p.x * 0.5 + 0.5) * 1440;
        const screenY = (-(p.y * 0.5) + 0.5) * 900;

        // In 1440x900 hero view:
        // Left headlight is around screenX: 720-750, screenY: 430-470
        // Right headlight is around screenX: 890-930, screenY: 480-520
        list.push({
          name: obj.name,
          parent: obj.parent ? obj.parent.name : null,
          matName: obj.material ? obj.material.name : null,
          color: obj.material && obj.material.color ? obj.material.color.getHexString() : null,
          screenX: +screenX.toFixed(1),
          screenY: +screenY.toFixed(1),
          worldCenter: { x: +center.x.toFixed(2), y: +center.y.toFixed(2), z: +center.z.toFixed(2) }
        });
      }
    });

    // Sort by proximity to screenX: 735, screenY: 450 (left headlight)
    const leftHeadCandidates = [...list].sort((a,b) => {
      const distA = Math.hypot(a.screenX - 735, a.screenY - 450);
      const distB = Math.hypot(b.screenX - 735, b.screenY - 450);
      return distA - distB;
    }).slice(0, 8);

    // Proximity to right headlight (around screenX: 915, screenY: 495)
    const rightHeadCandidates = [...list].sort((a,b) => {
      const distA = Math.hypot(a.screenX - 915, a.screenY - 495);
      const distB = Math.hypot(b.screenX - 915, b.screenY - 495);
      return distA - distB;
    }).slice(0, 8);

    return { leftHeadCandidates, rightHeadCandidates };
  });

  console.log('PROJECTED HEADLIGHT CANDIDATES:');
  console.log(JSON.stringify(projectedMeshes, null, 2));
  await browser.close();
})();
