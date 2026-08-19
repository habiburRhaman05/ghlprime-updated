import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 180000 })
await page.evaluate(() => {
  const el = document.querySelector('.our-stack-section')
  if (el) el.scrollIntoView()
})
await new Promise((r) => setTimeout(r, 2500))
const el = await page.$('.our-stack-section')
if (!el) { console.log('SECTION NOT FOUND'); await browser.close(); process.exit(1) }
await el.screenshot({ path: 'C:/Users/success/AppData/Local/Temp/claude/f--ghlprime-com-ghlprime-updated/bd6a7508-d9e8-4033-82ba-e985745ea735/scratchpad/our-stack.png' })
const box = await el.boundingBox()
console.log('box', JSON.stringify(box))
await browser.close()
