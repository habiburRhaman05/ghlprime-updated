const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('console', msg => {
    if (['error','warning'].includes(msg.type())) errors.push(`${msg.type()}: ${msg.text()}`)
  });
  const response = await page.goto('https://dev.ghlprime.com', { waitUntil: 'networkidle', timeout: 120000 });
  const bodyText = await page.locator('body').innerText().catch(() => '');
  console.log(JSON.stringify({ status: response && response.status(), bodyText: bodyText.slice(0, 500), errors }, null, 2));
  await browser.close();
})();
