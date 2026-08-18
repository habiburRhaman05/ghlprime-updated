const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  const measure = () => page.evaluate(() => {
    const nav = document.querySelector('.navbar');
    const items = [...nav.children].map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        cls: el.className,
        display: cs.display,
        gridArea: cs.gridArea,
        gridRow: cs.gridRowStart + '/' + cs.gridRowEnd,
        gridCol: cs.gridColumnStart + '/' + cs.gridColumnEnd,
        x: r.x, w: r.width, h: r.height,
      };
    });
    const navCS = getComputedStyle(nav);
    return {
      cols: navCS.gridTemplateColumns,
      rows: navCS.gridTemplateRows,
      gap: navCS.gap,
      justify: navCS.justifyContent,
      items,
    };
  });

  console.log('=== BEFORE OPEN ===');
  console.log(JSON.stringify(await measure(), null, 2));

  await page.click('.mobile-menu-toggle');
  await page.waitForTimeout(400);

  console.log('=== AFTER OPEN ===');
  console.log(JSON.stringify(await measure(), null, 2));
  await browser.close();
})();
