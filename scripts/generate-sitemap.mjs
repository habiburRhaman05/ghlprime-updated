// Posts merged into a canonical URL and 301-redirected in vercel.json.
// Excluded here so the sitemap never advertises a redirecting URL.
const MERGED_BLOG_SLUGS = new Set([
  'how-to-set-up-gohighlevel-saas-mode',
  '5-gohighlevel-automation-workflows-every-agency-needs',
])

﻿import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')

const LASTMOD = '2026-05-31'

const routes = [
  { loc: 'https://ghlprime.com/', changefreq: 'weekly', priority: '1.0' },
  { loc: 'https://ghlprime.com/services', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://ghlprime.com/services/vibe-coding', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/ai-agent-builder', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/custom-saas-development', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/figma-to-code', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/saas-customer-support', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/ghl-setup', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/automation', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/saas-crm', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/white-label-support', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/services/app-development', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/case-studies', changefreq: 'weekly', priority: '0.9' },
  { loc: 'https://ghlprime.com/blog', changefreq: 'weekly', priority: '0.8' },
  { loc: 'https://ghlprime.com/gallery', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://ghlprime.com/faq', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/about', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/team', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://ghlprime.com/contact', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://ghlprime.com/booking', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://ghlprime.com/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: 'https://ghlprime.com/terms', changefreq: 'yearly', priority: '0.3' },
]

// Best-effort: append published blog post URLs from Supabase. Never throw â€” if
// creds are missing or the fetch fails, we just keep the static routes above.
async function readSupabaseCreds() {
  const creds = { url: '', anonKey: '' }
  try {
    const envPath = path.join(root, '.env')
    const raw = await fs.readFile(envPath, 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      let value = trimmed.slice(idx + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (key === 'VITE_SUPABASE_URL') creds.url = value
      if (key === 'VITE_SUPABASE_ANON_KEY') creds.anonKey = value
    }
  } catch {
    // .env not present â€” fall through to process.env
  }
  if (!creds.url) creds.url = process.env.VITE_SUPABASE_URL || ''
  if (!creds.anonKey) creds.anonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
  return creds
}

try {
  const { url, anonKey } = await readSupabaseCreds()
  if (url && anonKey) {
    const res = await fetch(`${url}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    })
    if (res.ok) {
      const rows = await res.json()
      if (Array.isArray(rows)) {
        for (const row of rows) {
          if (row && row.slug) {
            if (MERGED_BLOG_SLUGS.has(row.slug)) continue
            routes.push({ loc: `https://ghlprime.com/blog/${row.slug}`, changefreq: 'monthly', priority: '0.7' })
          }
        }
        console.log(`Added ${rows.length} published blog post URLs from Supabase.`)
      }
    } else {
      console.log(`Skipping blog slugs: Supabase responded ${res.status}.`)
    }
  } else {
    console.log('Skipping blog slugs: Supabase credentials not found.')
  }
} catch (error) {
  console.log(`Skipping blog slugs: ${error?.message || 'fetch failed'}.`)
}

// Best-effort: append published case study URLs from Supabase. Never throw â€” if
// creds are missing or the fetch fails, we fall back to the 3 local-fallback
// slugs only. The 3 fallbacks are always included and de-duped against the DB.
const caseStudyFallbackSlugs = [
]
const caseStudySlugSet = new Set()
try {
  const { url, anonKey } = await readSupabaseCreds()
  if (url && anonKey) {
    const res = await fetch(`${url}/rest/v1/case_studies?select=slug,updated_at&published=eq.true`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    })
    if (res.ok) {
      const rows = await res.json()
      if (Array.isArray(rows)) {
        for (const row of rows) {
          if (row && row.slug) caseStudySlugSet.add(row.slug)
        }
        console.log(`Added ${caseStudySlugSet.size} published case study slugs from Supabase.`)
      }
    } else {
      console.log(`Skipping case study slugs: Supabase responded ${res.status}.`)
    }
  } else {
    console.log('Skipping case study slugs: Supabase credentials not found.')
  }
} catch (error) {
  console.log(`Skipping case study slugs: ${error?.message || 'fetch failed'}.`)
}
// Always include the 3 local-fallback slugs (de-duped against the DB results).
for (const slug of caseStudyFallbackSlugs) caseStudySlugSet.add(slug)
for (const slug of caseStudySlugSet) {
  routes.push({ loc: `https://ghlprime.com/case-studies/${slug}`, changefreq: 'yearly', priority: '0.7' })
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) =>
      `  <url><loc>${r.loc}</loc><lastmod>${LASTMOD}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`

await fs.mkdir(publicDir, { recursive: true })
await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
console.log(`sitemap.xml generated (${routes.length} urls)`)