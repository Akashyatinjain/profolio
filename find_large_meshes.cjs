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

  const allMeshes = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    const list = [];
    scene.traverse(obj => {
      if (obj.isMesh) {
        const box = new THREE.Box3().setFromObject(obj);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        list.push({
          name: obj.name || 'unnamed',
          parent: obj.parent ? (obj.parent.name || obj.parent.type) : null,
          visible: obj.visible,
          matType: obj.material ? obj.material.type : null,
          color: obj.material && obj.material.color ? '#' + obj.material.color.getHexString() : null,
          opacity: obj.material ? obj.material.opacity : null,
          transparent: obj.material ? obj.material.transparent : null,
          size: { x: +size.x.toFixed(2), y: +size.y.toFixed(2), z: +size.z.toFixed(2) },
          center: { x: +center.x.toFixed(2), y: +center.y.toFixed(2), z: +center.z.toFixed(2) }
        });
      }
    });
    return list;
  });

  console.log('ALL MESHES IN SCENE:');
  console.log(JSON.stringify(allMeshes.filter(m => m.size.x > 5 || m.size.z > 5), null, 2));
  await browser.close();
})();
