const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  });
  const response = await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  const bodyText = await page.locator('body').innerText().catch(() => '');
  console.log(JSON.stringify({ status: response && response.status(), errors, bodyText: bodyText.slice(0, 500) }, null, 2));
  await browser.close();
})();
