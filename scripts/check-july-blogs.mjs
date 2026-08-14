// QA harness for the July 2026 blog batch. Run: node ./scripts/check-july-blogs.mjs
// Verifies word count, meta lengths, keyword placement, structure, schema, and
// that every internal link actually resolves (blog slugs in Supabase, routes in App.jsx).
import { readFileSync } from 'node:fs'
import { julyBlogPosts } from '../src/data/julyBlogPosts.js'

function parseEnv(p) {
  const e = {}
  for (const l of readFileSync(p, 'utf8').split(String.fromCharCode(10))) {
    const t = l.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    let v = t.slice(i + 1).trim()
    if (v.length > 1 && ((v[0] === '"' && v.endsWith('"')) || (v[0] === "'" && v.endsWith("'")))) v = v.slice(1, -1)
    e[t.slice(0, i).trim()] = v
  }
  return e
}
const env = parseEnv('.env')
const res = await fetch(env.VITE_SUPABASE_URL + '/rest/v1/blog_posts?select=slug&published=eq.true', {
  headers: { apikey: env.VITE_SUPABASE_ANON_KEY, Authorization: 'Bearer ' + env.VITE_SUPABASE_ANON_KEY },
})
const existing = new Set((await res.json()).map((r) => r.slug))
const appjsx = readFileSync('src/App.jsx', 'utf8')

const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ')
const words = (s) => stripTags(s).split(' ').map((w) => w.trim()).filter(Boolean)
function stripScripts(s) {
  let out = s
  for (;;) {
    const a = out.indexOf('<script')
    if (a < 0) break
    const b = out.indexOf('</script>', a)
    if (b < 0) break
    out = out.slice(0, a) + out.slice(b + 9)
  }
  return out
}
function between(s, open, close) {
  const out = []
  let i = 0
  for (;;) {
    const a = s.indexOf(open, i)
    if (a < 0) break
    const b = s.indexOf(close, a + open.length)
    if (b < 0) break
    out.push(s.slice(a + open.length, b))
    i = b + close.length
  }
  return out
}

let fails = 0
const flag = (cond, msg) => { if (!cond) { fails++; return 'FAIL ' + msg } return 'ok' }

for (const p of julyBlogPosts) {
  const prose = stripScripts(p.content)
  const wc = words(prose).length
  const paras = between(prose, '<p>', '</p>')
  const snip = paras.length ? words(paras[0]).length : 0
  const kw = p.seo_keywords.split(',')[0].trim().toLowerCase()
  const lower = stripTags(prose).toLowerCase()
  const first100 = words(prose).slice(0, 100).join(' ').toLowerCase()
  const h2s = between(prose, '<h2>', '</h2>').map((h) => h.replace(/<[^>]+>/g, ''))
  const qH2 = h2s.filter((h) => h.trim().endsWith('?')).length
  const links = between(p.content, "href='", "'")
  const occ = lower.split(kw).length - 1
  const isPillar = p.slug === 'what-is-ghl'
  const min = isPillar ? 2800 : 1800
  const max = isPillar ? 3500 : 2600

  console.log('='.repeat(58))
  console.log(p.published_at.slice(0, 10), '|', p.slug, '|', p.category)
  console.log('  words:', wc, flag(wc >= min && wc <= max, '(need ' + min + '-' + max + ')'))
  console.log('  reading_time:', p.reading_time, flag(p.reading_time === Math.round(wc / 200), '(should be ' + Math.round(wc / 200) + ')'))
  console.log('  title tag:', p.seo_title.length, flag(p.seo_title.length >= 50 && p.seo_title.length <= 60, '(need 50-60)'))
  console.log('  meta desc:', p.seo_description.length, flag(p.seo_description.length >= 150 && p.seo_description.length <= 160, '(need 150-160)'))
  console.log('  snippet para words:', snip, flag(snip >= 40 && snip <= 60, '(need 40-60)'))
  console.log('  kw "' + kw + '": title', flag(p.title.toLowerCase().includes(kw), 'title'),
    '| meta', flag(p.seo_description.toLowerCase().includes(kw), 'meta'),
    '| first100', flag(first100.includes(kw), 'first100'))
  console.log('  H2 total:', h2s.length, '| question H2s:', qH2, flag(qH2 >= 3, '(need 3+)'), '| kw occurrences:', occ)
  console.log('  table:', p.content.split('<table').length - 1, flag(p.content.includes('<table'), 'need 1 table'),
    '| <ol>:', p.content.split('<ol>').length - 1, flag(p.content.includes('<ol>'), 'need numbered list'))
  console.log('  FAQPage:', p.content.includes('FAQPage'), '| FAQ Qs:', p.content.split('"@type":"Question"').length - 1,
    '| HowTo:', p.content.includes('"@type":"HowTo"'))
  let svc = 0, blogs = 0, bad = 0
  for (const l of links) {
    let ok
    if (l.startsWith('/blog/')) { ok = existing.has(l.slice(6)); blogs++ }
    else { ok = appjsx.includes('path="' + l + '"'); if (l.startsWith('/services/')) svc++ }
    if (!ok) { bad++; console.log('     BROKEN LINK:', l) }
  }
  console.log('  links:', links.length, flag(links.length >= 4 && links.length <= 7, '(need 4-7)'),
    '| blog:', blogs, flag(blogs >= 2, '(need 2+)'), '| service:', svc, flag(svc === 1, '(need exactly 1)'),
    '| broken:', bad, flag(bad === 0, 'broken links'))
  if (!isPillar) console.log('  links to pillar:', links.includes('/blog/what-is-ghl') ? 'ok' : 'FAIL (must link to pillar)')
}
console.log('='.repeat(58))
console.log(fails === 0 ? 'ALL CHECKS PASSED' : 'TOTAL FAILURES: ' + fails)
