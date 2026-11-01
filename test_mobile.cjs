const puppeteer = require('./node_modules/puppeteer-core');
const fs = require('fs');

const possiblePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
let executablePath = possiblePaths.find(p => fs.existsSync(p));

(async () => {
  if (!executablePath) return;
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshot_mobile_hero.png' });
  console.log('Mobile hero captured');

  // Open mobile menu
  const burger = await page.$('.burger');
  if (burger) {
    await burger.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: 'screenshot_mobile_menu.png' });
    console.log('Mobile menu captured');
    await burger.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Scroll to problem solving on mobile
  await page.evaluate(() => {
    const el = document.getElementById('problem-solving');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'screenshot_mobile_telemetry.png' });
  console.log('Mobile telemetry captured');

  // Scroll to projects on mobile
  await page.evaluate(() => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'screenshot_mobile_projects.png' });
  console.log('Mobile projects captured');

  await browser.close();
  console.log('Mobile test completed cleanly');
})();

