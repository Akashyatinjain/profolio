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

  const frontMeshes = await page.evaluate(() => {
    const scene = window.__scene;
    const THREE = window.__THREE;
    const list = [];
    scene.traverse(obj => {
      if (obj.isMesh && obj.visible) {
        const box = new THREE.Box3().setFromObject(obj);
        // Let's check objects at the front of the car
        if (box.min.z < 0 || box.max.z < 0) {
          list.push({
            name: obj.name,
            matName: obj.material ? obj.material.name : '',
            matType: obj.material ? obj.material.type : '',
            color: obj.material && obj.material.color ? '#' + obj.material.color.getHexString() : '',
            map: obj.material && obj.material.map ? true : false,
            boxMin: box.min,
            boxMax: box.max
          });
        }
      }
    });
    return list;
  });

  console.log('VISIBLE FRONT MESHES:');
  console.log(JSON.stringify(frontMeshes, null, 2));
  await browser.close();
})();
