import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------

// Items placed on a given page (page_key = 'home' | 'service:<slug>'), ordered
// by the per-page placement sort_order. The API only returns enabled
// placements for published-adjacent items, matching the previous RLS-filtered
// embed behaviour.
export async function fetchShowcaseForPage(pageKey) {
  if (!pageKey) return []

  const { data, error } = await apiGet(`/api/showcase/page/${encodeURIComponent(pageKey)}`)
  if (error || !data) return []
  // The page route returns `{ items, stats }`; callers here only consume items.
  return Array.isArray(data.items) ? data.items : []
}

export async function fetchShowcaseStats() {
  const { data, error } = await apiGet('/api/showcase/stats')
  if (error || !data) return []
  return data
}

// ---------------------------------------------------------------------------
// Admin: items + placements
// ---------------------------------------------------------------------------

export async function fetchAdminShowcaseItems() {
  const { data, error } = await apiGet('/api/showcase/items/admin', { auth: true })
  if (error || !data) return []
  return data
}

export async function createShowcaseItem(payload) {
  return apiPost('/api/showcase/items', payload, { auth: true })
}

export async function updateShowcaseItem(id, payload) {
  return apiPut(`/api/showcase/items/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteShowcaseItem(id) {
  const { error } = await apiDelete(`/api/showcase/items/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}

// ---------------------------------------------------------------------------
// Admin: stat tiles
// ---------------------------------------------------------------------------

export async function fetchAdminShowcaseStats() {
  const { data, error } = await apiGet('/api/showcase/stats/admin', { auth: true })
  if (error || !data) return []
  return data
}

export async function createShowcaseStat(payload) {
  return apiPost('/api/showcase/stats', payload, { auth: true })
}

export async function updateShowcaseStat(id, payload) {
  return apiPut(`/api/showcase/stats/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteShowcaseStat(id) {
  const { error } = await apiDelete(`/api/showcase/stats/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}
