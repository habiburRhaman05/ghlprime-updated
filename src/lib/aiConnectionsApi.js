import { apiDelete, apiGet, apiPost, apiPut } from './apiClient'

// AI Connections admin API — everything about connecting/managing the
// Claude accounts (including the advanced API-key auth path) and the Codex
// ambient login. Split out of blogAiApi.js when the connector UI moved to
// its own page (AdminAiConnectionsPage.jsx) — settings/run-now/runs stay in
// blogAiApi.js since AdminBlogAiPage.jsx still owns those.

const BASE = '/api/admin/blog-ai'

// -- Claude accounts ----------------------------------------------------------

export async function fetchBlogAiAccounts() {
  const { data, error } = await apiGet(`${BASE}/accounts`, { auth: true })
  return { data, error }
}

// `authType` defaults to 'oauth' (the manual-paste "Connect an account"
// row); pass 'api_key' for the advanced "use an API key instead" row.
export async function createBlogAiAccount({ label, token, model, authType = 'oauth' }) {
  const { data, error } = await apiPost(
    `${BASE}/accounts`,
    { label, token, model, auth_type: authType },
    { auth: true },
  )
  return { data, error }
}

export async function updateBlogAiAccount(id, payload) {
  const { data, error } = await apiPut(`${BASE}/accounts/${encodeURIComponent(id)}`, payload, { auth: true })
  return { data, error }
}

export async function deleteBlogAiAccount(id) {
  const { error } = await apiDelete(`${BASE}/accounts/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}

export async function testBlogAiAccount(id) {
  const { data, error } = await apiPost(`${BASE}/accounts/${encodeURIComponent(id)}/test`, undefined, { auth: true })
  return { data, error }
}

// "Test all (say hi)" — tests every enabled Claude account concurrently.
// Returns { data: [{ accountId, label, ok, message }], error }.
export async function testAllBlogAiAccounts() {
  const { data, error } = await apiPost(`${BASE}/accounts/test-all`, undefined, { auth: true })
  return { data, error }
}

// -- Claude "connect from this browser" (no SSH) -----------------------------

export async function startClaudeConnect(label) {
  const { data, error } = await apiPost(`${BASE}/accounts/connect/claude/start`, { label }, { auth: true })
  return { data, error }
}

export async function fetchClaudeConnectStatus(sessionId) {
  const { data, error } = await apiGet(`${BASE}/accounts/connect/claude/${encodeURIComponent(sessionId)}`, { auth: true })
  return { data, error }
}

export async function submitClaudeConnectCode(sessionId, code) {
  const { data, error } = await apiPost(
    `${BASE}/accounts/connect/claude/${encodeURIComponent(sessionId)}/code`,
    { code },
    { auth: true },
  )
  return { data, error }
}

export async function cancelClaudeConnect(sessionId) {
  const { error } = await apiDelete(`${BASE}/accounts/connect/claude/${encodeURIComponent(sessionId)}`, { auth: true })
  return { error }
}

// -- Codex (single ambient-login connection, no accounts table rows) --------

export async function testCodexConnection() {
  const { data, error } = await apiPost(`${BASE}/codex/test`, undefined, { auth: true })
  return { data, error }
}

export async function startCodexConnect() {
  const { data, error } = await apiPost(`${BASE}/codex/connect/start`, undefined, { auth: true })
  return { data, error }
}

export async function fetchCodexConnectStatus(sessionId) {
  const { data, error } = await apiGet(`${BASE}/codex/connect/${encodeURIComponent(sessionId)}`, { auth: true })
  return { data, error }
}

export async function fetchCodexStatus() {
  const { data, error } = await apiGet(`${BASE}/codex/status`, { auth: true })
  return { data, error }
}

export async function cancelCodexConnect(sessionId) {
  const { error } = await apiDelete(`${BASE}/codex/connect/${encodeURIComponent(sessionId)}`, { auth: true })
  return { error }
}

export async function disconnectCodex() {
  const { data, error } = await apiPost(`${BASE}/codex/disconnect`, undefined, { auth: true })
  return { data, error }
}
