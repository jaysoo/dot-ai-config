const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const pages = ['screen-overview', 'screen-logview', 'concept'];
  for (const name of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
    await page.goto('file://' + path.join(__dirname, name + '.html'), { waitUntil: 'networkidle0' });
    const el = await page.$('.stage');
    const box = await el.boundingBox();
    // pad around the stage
    const pad = 40;
    await page.screenshot({
      path: name + '.png',
      clip: {
        x: Math.max(0, box.x - pad),
        y: Math.max(0, box.y - pad),
        width: box.width + pad * 2,
        height: box.height + pad * 2,
      },
    });
    console.log('rendered', name);
    await page.close();
  }
  await browser.close();
})();
