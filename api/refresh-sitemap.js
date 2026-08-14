/* global process */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')

const baseUrl = process.env.SITE_URL || 'https://ghlprime.com'
// Server-side base URL for the self-hosted Express API (NOT the VITE_-prefixed
// browser var, though that's accepted as a fallback in case only it is set).
const apiBaseUrl = (process.env.API_URL || process.env.VITE_API_URL || '').replace(/\/$/, '')

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/team', changefreq: 'monthly', priority: '0.8' },
  { path: '/booking', changefreq: 'weekly', priority: '0.9' },
  { path: '/case-studies', changefreq: 'weekly', priority: '0.8' },
]

async function fetchFallbackStudies() {
  const module = await import('../src/data/caseStudies.js')
  return module.caseStudies || []
}

async function fetchPublishedStudies() {
  if (!apiBaseUrl) {
    return fetchFallbackStudies()
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/case-studies`)
    if (!response.ok) {
      return fetchFallbackStudies()
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      return fetchFallbackStudies()
    }

    // The API already filters to published=true, ordered by created_at desc —
    // only slug/updated_at are used below.
    return data
  } catch {
    return fetchFallbackStudies()
  }
}

function buildXml(routes) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path === '/' ? '' : route.path}</loc>${route.lastmod ? `
    <lastmod>${route.lastmod}</lastmod>` : ''}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
}

async function generateSitemap() {
  const studies = await fetchPublishedStudies()
  const seen = new Set()

  const studyRoutes = studies
    .filter((study) => typeof study?.slug === 'string' && study.slug.trim())
    .filter((study) => {
      if (seen.has(study.slug)) return false
      seen.add(study.slug)
      return true
    })
    .map((study) => ({
      path: `/case-studies/${study.slug}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: study.updated_at ? new Date(study.updated_at).toISOString() : undefined,
    }))

  const xml = buildXml([...staticRoutes, ...studyRoutes])

  await fs.mkdir(publicDir, { recursive: true })
  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')

  return { count: staticRoutes.length + studyRoutes.length }
}

export default async function handler(req, res) {
  if (req.method && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization || ''
  const providedToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : req.headers['x-sitemap-token']

  const requiredToken = process.env.SITEMAP_REFRESH_TOKEN

  if (requiredToken && providedToken !== requiredToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const result = await generateSitemap()
    return res.status(200).json({ success: true, ...result })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to refresh sitemap' })
  }
}

export { generateSitemap }
