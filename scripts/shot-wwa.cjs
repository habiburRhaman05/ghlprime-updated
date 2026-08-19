const puppeteer = require('puppeteer')

const WIDTHS = [1440, 1024, 780, 560, 390]

;(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  for (const w of WIDTHS) {
    const page = await browser.newPage()
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 2 })
    await page.goto(process.env.URL || 'http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 90000 })

    // whileInView needs the section actually scrolled to, and in small steps --
    // one big jump outruns the IntersectionObserver and the cards stay at
    // opacity 0 in the capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 350) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
    })
    await page.evaluate(() => document.querySelector('.what-we-are-section')?.scrollIntoView({ block: 'center' }))
    await new Promise((r) => setTimeout(r, 900))

    const el = await page.$('.what-we-are-section')
    await el.screenshot({ path: `scripts/shot-wwa-${w}.png` })

    const info = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.wwa-feature')]
      return cards.map((c) => {
        const cs = getComputedStyle(c)
        const icon = c.querySelector('.wwa-feature-icon')
        const title = c.querySelector('strong')
        return {
          tone: c.className.replace('wwa-feature ', ''),
          card: Math.round(c.getBoundingClientRect().width) + 'x' + Math.round(c.getBoundingClientRect().height),
          iconW: Math.round(icon.getBoundingClientRect().width),
          iconH: Math.round(icon.getBoundingClientRect().height),
          bg: cs.backgroundColor,
          borderBottom: cs.borderBottomWidth + ' ' + cs.borderBottomColor,
          // gap between the bottom of the art and the top of the title --
          // this is the "unnecessary vertical space" being checked
          gap: Math.round(title.getBoundingClientRect().top - icon.getBoundingClientRect().bottom),
        }
      })
    })
    console.log(`\n--- ${w}px ---`)
    console.table(info)
    await page.close()
  }
  await browser.close()
})()
