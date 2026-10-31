const fs = require('fs');
const puppeteer = require('./node_modules/puppeteer-core');

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
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Load the screenshot image into page to sample its pixel data via canvas
  const imgBase64 = fs.readFileSync('C:/Users/Akash/.gemini/antigravity-ide/brain/f8540bce-d12d-4be2-8511-97fe42b16696/current_hero_state.png').toString('base64');
  
  await page.setContent(`
    <img id="img" src="data:image/png;base64,${imgBase64}" />
    <canvas id="c"></canvas>
  `);

  const colors = await page.evaluate(() => {
    const img = document.getElementById('img');
    const c = document.getElementById('c');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const getPixel = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
    };

    return {
      topArea_200_200: getPixel(200, 200),
      topArea_1200_200: getPixel(1200, 200),
      midHorizon_1200_450: getPixel(1200, 450),
      bottomArea_200_700: getPixel(200, 700),
      bottomArea_1200_700: getPixel(1200, 700),
      bottomArea_600_850: getPixel(600, 850),
    };
  });

  console.log('SAMPLED COLORS:', JSON.stringify(colors, null, 2));
  await browser.close();
})();
