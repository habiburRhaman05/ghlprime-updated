import { apiGet, apiPost, apiPut } from './apiClient'

// Auto Blog generation-settings + run API. Everything about *connecting*
// Claude/Codex accounts (accounts CRUD, the "connect in browser" flows,
// Codex status/disconnect, bulk test) lives in aiConnectionsApi.js instead —
// this file only covers what's left on AdminBlogAiPage.jsx: the shared
// generation settings, "Run Now", and the run history table.

const BASE = '/api/admin/blog-ai'

export async function fetchBlogAiSettings() {
  const { data, error } = await apiGet(`${BASE}/settings`, { auth: true })
  return { data, error }
}

export async function saveBlogAiSettings(payload) {
  const { data, error } = await apiPut(`${BASE}/settings`, payload, { auth: true })
  return { data, error }
}

export async function runBlogAiNow() {
  const { data, error } = await apiPost(`${BASE}/run-now`, undefined, { auth: true })
  return { data, error }
}

export async function fetchBlogAiRuns(limit = 50) {
  const { data, error } = await apiGet(`${BASE}/runs?limit=${encodeURIComponent(limit)}`, { auth: true })
  return { data, error }
}
