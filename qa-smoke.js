const { chromium } = require('playwright');
(async() => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const routes = ['/', '/services', '/about', '/team', '/client-studies', '/login'];
  const results = [];

  for (const route of routes) {
    const response = await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle' });
    const title = await page.locator('h1').first().textContent().catch(() => 'NO_H1');
    const hasBody = await page.locator('body').count();
    const text = await page.locator('body').innerText();
    results.push({ route, status: response ? response.status() : 'NO_RESPONSE', title, body: !!hasBody, textSnippet: text.slice(0, 180) });
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
