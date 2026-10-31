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

  const sceneAnalysis = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    if (!scene || !THREE) return 'No scene or THREE';
    const meshes = [];
    scene.traverse(obj => {
      if (obj.isMesh) {
        const worldPos = new THREE.Vector3();
        obj.getWorldPosition(worldPos);
        const worldBox = new THREE.Box3().setFromObject(obj);
        meshes.push({
          name: obj.name,
          visible: obj.visible,
          matName: obj.material ? obj.material.name : '',
          color: obj.material && obj.material.color ? obj.material.color.getHexString() : '',
          emissive: obj.material && obj.material.emissive ? obj.material.emissive.getHexString() : '',
          roughness: obj.material ? obj.material.roughness : null,
          metalness: obj.material ? obj.material.metalness : null,
          boxMin: { x: +worldBox.min.x.toFixed(2), y: +worldBox.min.y.toFixed(2), z: +worldBox.min.z.toFixed(2) },
          boxMax: { x: +worldBox.max.x.toFixed(2), y: +worldBox.max.y.toFixed(2), z: +worldBox.max.z.toFixed(2) },
          center: { x: +((worldBox.min.x + worldBox.max.x)/2).toFixed(2), y: +((worldBox.min.y + worldBox.max.y)/2).toFixed(2), z: +((worldBox.min.z + worldBox.max.z)/2).toFixed(2) }
        });
      }
    });
    return meshes;
  });

  console.log(JSON.stringify(sceneAnalysis, null, 2));
  await browser.close();
})();
