import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.porsche-canvas-container.is-ready', { timeout: 30000 });

  const result = await page.evaluate(async () => {
    // We can load the GLB directly in window using THREE and GLTFLoader if present, or inspect the scene
    const { GLTFLoader } = await import('/node_modules/.vite/deps/three_examples_jsm_loaders_GLTFLoader__js.js').catch(async () => {
      return await import('three/examples/jsm/loaders/GLTFLoader.js');
    });
    const THREE = await import('three');

    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load('/models/porsche_911.glb', (gltf) => {
        const scene = gltf.scene;
        const totalBox = new THREE.Box3().setFromObject(scene);

        const meshes = [];
        scene.traverse((child) => {
          if (child.isMesh) {
            const b = new THREE.Box3().setFromObject(child);
            const mats = child.material ? (Array.isArray(child.material) ? child.material.map(m => m.name) : [child.material.name]) : [];
            meshes.push({
              name: child.name,
              materials: mats,
              minY: b.min.y,
              maxY: b.max.y,
              minX: b.min.x,
              maxX: b.max.x,
              minZ: b.min.z,
              maxZ: b.max.z,
            });
          }
        });

        // Sort by lowest Y
        meshes.sort((a, b) => a.minY - b.minY);

        resolve({
          totalMin: totalBox.min,
          totalMax: totalBox.max,
          totalSize: totalBox.getSize(new THREE.Vector3()),
          lowestMeshes: meshes.slice(0, 10),
          wheelMeshes: meshes.filter(m => m.materials.some(mat => mat.includes('tire') || mat.includes('rim'))),
        });
      });
    });
  });

  console.log('--- GLB BOUNDING BOX ANALYSIS ---');
  console.log('Total Box Min:', result.totalMin);
  console.log('Total Box Max:', result.totalMax);
  console.log('Total Size:', result.totalSize);
  console.log('\nLowest 5 Meshes in the entire model:');
  for (const m of result.lowestMeshes.slice(0, 5)) {
    console.log(`  ${m.name} (${m.materials.join(', ')}): minY = ${m.minY.toFixed(4)}, maxY = ${m.maxY.toFixed(4)}`);
  }
  console.log('\nWheel/Tire Meshes:');
  for (const m of result.wheelMeshes) {
    console.log(`  ${m.name} (${m.materials.join(', ')}): minY = ${m.minY.toFixed(4)}, maxY = ${m.maxY.toFixed(4)}`);
  }

  await browser.close();
})();
