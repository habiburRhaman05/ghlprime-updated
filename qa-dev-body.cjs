const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://dev.ghlprime.com', { waitUntil: 'networkidle', timeout: 120000 });
  const bodyText = await page.locator('body').innerText();
  console.log(bodyText.slice(0, 2500));
  await browser.close();
})();
