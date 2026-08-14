const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://dev.ghlprime.com', { waitUntil: 'networkidle', timeout: 120000 });
  const h1 = await page.locator('h1').first().innerText().catch(() => 'NO_H1');
  const heroText = await page.locator('.hero').first().innerText().catch(() => 'NO_HERO');
  console.log(JSON.stringify({ h1, heroText }, null, 2));
  await browser.close();
})();
