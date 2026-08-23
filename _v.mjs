import { chromium } from 'playwright'
const SP = process.argv[2]
const b = await chromium.launch()
const bad=[]
const is3d = t => t.startsWith('matrix3d')
for (const [route,name,w] of [['/about','about',1440],['/team','team',1440],['/about','about-m',390],['/team','team-m',390]]) {
  const p = await b.newPage({ viewport:{width:w,height:900}, deviceScaleFactor: w>500?2:2 })
  const errs=[]
  p.on('pageerror', e=>errs.push(String(e).slice(0,200)))
  await p.goto(`http://localhost:3000${route}`, { waitUntil:'domcontentloaded', timeout:90000 })
  await p.waitForTimeout(4500)
  // walk the page so every reveal fires, then confirm nothing is left rotated
  const H = await p.evaluate(()=>document.body.scrollHeight)
  for (let y=0;y<H;y+=640){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(230) }
  for (let y=H;y>0;y-=640){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(160) }
  await p.waitForTimeout(1200)
  const r = await p.evaluate(() => {
    const flat = t => {
      if (!t || t === 'none') return true
      if (t.startsWith('matrix3d')) { const m=t.slice(9,-1).split(',').map(Number)
        return ![m[1],m[2],m[4],m[6],m[8],m[9]].some(v=>Math.abs(v)>0.001) }
      return /^matrix\(1, 0, 0, 1, [-\d.]+, [-\d.]+\)$/.test(t)
    }
    const els=[...document.querySelectorAll('.pv2-card,.pv2-expert,.pv2-check,.pv2-cta,.pv2-prose')]
    return {
      total: els.length,
      dim: els.filter(e=>Number(getComputedStyle(e).opacity)<0.95).length,
      rotated: els.filter(e=>!flat(getComputedStyle(e).transform)).length,
      overflow: document.documentElement.scrollWidth-document.documentElement.clientWidth,
    }
  })
  if (r.dim) bad.push(`${name}: ${r.dim} dim`)
  if (r.rotated) bad.push(`${name}: ${r.rotated} rotated`)
  if (r.overflow) bad.push(`${name}: overflow ${r.overflow}`)
  if (errs.length) bad.push(`${name}: ${errs[0]}`)
  console.log(name.padEnd(10), JSON.stringify(r))
  await p.close()
}
// interactions on desktop
const p = await b.newPage({ viewport:{width:1440,height:900}, deviceScaleFactor: 2 })
await p.goto('http://localhost:3000/team', { waitUntil:'domcontentloaded', timeout:60000 })
await p.waitForTimeout(4000)
const y = await p.evaluate(()=>document.querySelector('.pv2-experts').getBoundingClientRect().top+window.scrollY)
await p.evaluate(v=>window.scrollTo(0,v-200), y); await p.waitForTimeout(1600)
const bx = await p.evaluate(()=>{const q=document.querySelector('.pv2-expert').getBoundingClientRect();return{x:q.x,y:q.y,w:q.width,h:q.height}})
await p.mouse.move(bx.x+bx.w/2, bx.y+bx.h/2); await p.waitForTimeout(1000)
console.log('expert flip 3D:', is3d(await p.evaluate(()=>getComputedStyle(document.querySelector('.pv2-flip')).transform)))
await p.screenshot({ path: `${SP}/team-experts.png`, clip: { x:0, y: Math.max(0,bx.y-70), width:1440, height:560 } })
await p.close()
console.log('\nPROBLEMS:', bad.length?bad:'none')
await b.close()
