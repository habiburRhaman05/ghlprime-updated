// Thin fetch wrapper for the self-hosted GHL Prime Express API (replaces the
// Supabase JS client). Every helper resolves to a Supabase-style
// `{ data, error }` shape so existing callers (the *Api.js files and admin
// pages, which already destructure `{ data, error }` from Supabase calls)
// don't need to change how they consume the result.

// In dev (Vite dev server on :5173) the API runs separately on :5013, so we
// need an absolute URL. In production the API is always reverse-proxied
// through the same Nginx host that serves the static site, so a relative
// path works on any domain it's deployed to (dev/stg/prod) with no rebuild.
export const API_BASE_URL = 
  process.env.VITE_API_URL || 'http://localhost:5013' 

const TOKEN_STORAGE_KEY = 'ghlprime_admin_token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    // localStorage unavailable (private mode / SSR) — session just won't persist.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // ignore
  }
}

async function parseJsonBody(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function errorMessageFrom(payload, fallback) {
  return payload?.error?.message
    || (typeof payload?.error === 'string' ? payload.error : null)
    || payload?.message
    || fallback
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (networkError) {
    return { data: null, error: new Error(networkError?.message || 'Network request failed') }
  }

  const payload = await parseJsonBody(response)

  if (!response.ok) {
    return { data: null, error: new Error(errorMessageFrom(payload, `Request failed (${response.status})`)) }
  }

  // The Express API wraps every success in a `{ success, message, data }`
  // envelope. Unwrap it here so callers keep receiving the Supabase-style
  // `{ data, error }` contract every *Api.js helper was written against --
  // `data` is the envelope's `data`, not the envelope itself.
  return { data: payload?.data !== undefined ? payload.data : payload, error: null }
}

export const apiGet = (path, options) => request(path, { ...options, method: 'GET' })
export const apiPost = (path, body, options) => request(path, { ...options, method: 'POST', body })
export const apiPut = (path, body, options) => request(path, { ...options, method: 'PUT', body })
export const apiPatch = (path, body, options) => request(path, { ...options, method: 'PATCH', body })
export const apiDelete = (path, options) => request(path, { ...options, method: 'DELETE' })

// Dedicated upload helper — posts multipart/form-data instead of JSON, so it
// can't go through request() above (that always forces a JSON Content-Type).
// Deliberately doesn't set Content-Type itself: the browser fills in the
// multipart boundary only when it's left unset.
export async function uploadImage(file) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const formData = new FormData()
  formData.append('file', file)

  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/uploads/image`, {
      method: 'POST',
      headers,
      body: formData,
    })
  } catch (networkError) {
    return { data: null, error: new Error(networkError?.message || 'Network request failed') }
  }

  const payload = await parseJsonBody(response)

  if (!response.ok) {
    return { data: null, error: new Error(errorMessageFrom(payload, `Upload failed (${response.status})`)) }
  }

  return { data: payload?.data !== undefined ? payload.data : payload, error: null }
}
