import { caseStudies } from '../data/caseStudies'
import contentSnapshot from '../data/contentSnapshot.json'
import { apiGet, apiPost, apiPut } from './apiClient'

// Merge case-study arrays by slug. Entries from `primary` win on slug
// collisions; any `secondary` entry whose slug is absent from `primary` is
// appended. Used so static flagship studies that live only in caseStudies.js
// (and are linked from the nav, homepage, and sitemap) always resolve, even
// when they are absent from the API / the content snapshot.
function mergeStudiesBySlug(primary, secondary) {
  const seen = new Set()
  const merged = []
  for (const list of [primary, secondary]) {
    for (const item of list || []) {
      if (!item || !item.slug || seen.has(item.slug)) continue
      seen.add(item.slug)
      merged.push(item)
    }
  }
  return merged
}

const SNAPSHOT_STUDIES = Array.isArray(contentSnapshot.caseStudies) ? contentSnapshot.caseStudies : []

// Snapshot/live data takes precedence; static caseStudies.js entries fill in any
// slug the snapshot lacks (e.g. the always-on flagship case studies).
const FALLBACK_STUDIES = mergeStudiesBySlug(SNAPSHOT_STUDIES, caseStudies)

// Synchronous seed for first paint / prerender, exported so the case-study pages
// render real content on the first frame instead of a loading/not-found flash.
export const SEEDED_CASE_STUDIES = FALLBACK_STUDIES

async function refreshSitemap() {
  try {
    const response = await fetch('/api/refresh-sitemap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const body = await response.text()
      console.warn('Sitemap refresh failed:', body)
    }
  } catch (error) {
    console.warn('Sitemap refresh request failed:', error)
  }
}

function mapFallbackStudy(item) {
  if (!item) return null

  return {
    ...item,
    assigned_team_members: [],
  }
}

export async function fetchCaseStudies() {
  const { data, error } = await apiGet('/api/case-studies')
  if (error || !data) return FALLBACK_STUDIES.map(mapFallbackStudy)
  // Append static flagship studies not present in the live result so the index
  // always has a card for every nav/sitemap link. Live data wins on slug match.
  return mergeStudiesBySlug(data, caseStudies)
}

export async function fetchCaseStudyBySlug(slug) {
  const { data, error } = await apiGet(`/api/case-studies/slug/${encodeURIComponent(slug)}`)

  if (error || !data) {
    return mapFallbackStudy(FALLBACK_STUDIES.find((item) => item.slug === slug) ?? null)
  }

  return data
}

export async function fetchAdminCaseStudies() {
  const { data, error } = await apiGet('/api/case-studies/admin', { auth: true })
  if (error || !data) return FALLBACK_STUDIES.map(mapFallbackStudy)
  return data
}

export async function createCaseStudy(payload) {
  const { data, error } = await apiPost('/api/case-studies', payload, { auth: true })
  if (error) return { data: null, error }

  await refreshSitemap()
  return { data, error: null }
}

export async function updateCaseStudy(id, payload) {
  const { data, error } = await apiPut(`/api/case-studies/${encodeURIComponent(id)}`, payload, { auth: true })
  if (error) return { data: null, error }

  await refreshSitemap()
  return { data, error: null }
}
