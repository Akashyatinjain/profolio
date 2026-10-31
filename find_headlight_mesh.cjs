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

  // Let's raycast from screen coordinates at the headlights.
  // In 1440x900, the left headlight is roughly at x=735, y=450, right headlight is at x=910, y=455
  const hitResults = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    // We can find all meshes in scene and their screen projection!
    // Or let's project each mesh to screen coordinates
    const camera = scene.children.find(c => c.isCamera) || null; // wait, camera wasn't added to scene, but let's find it or raycast
    // Let's find meshes that have 'Circle' in name or are near front
    const hits = [];
    scene.traverse(obj => {
      if (obj.isMesh && obj.visible) {
        const box = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box.getCenter(center);
        // Headlights are roughly around Y: 0.5-0.8, and in world space X: 1.5 - 2.5, Z: -1.5 - 0.5
        hits.push({
          name: obj.name,
          parent: obj.parent ? obj.parent.name : null,
          matName: obj.material ? obj.material.name : null,
          color: obj.material && obj.material.color ? obj.material.color.getHexString() : null,
          map: !!(obj.material && obj.material.map),
          center: { x: +center.x.toFixed(2), y: +center.y.toFixed(2), z: +center.z.toFixed(2) },
          size: { x: +(box.max.x - box.min.x).toFixed(2), y: +(box.max.y - box.min.y).toFixed(2), z: +(box.max.z - box.min.z).toFixed(2) }
        });
      }
    });
    return hits;
  });

  console.log('ALL VISIBLE MESHES:');
  console.log(JSON.stringify(hitResults, null, 2));
  await browser.close();
})();
