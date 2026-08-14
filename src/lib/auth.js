// Replaces Supabase Auth with the self-hosted Express API's JWT login.
// Session shape mirrors what src/components/AdminShell.jsx and the admin
// pages already expect from supabase.auth: `{ user: { email, ... } }`, plus
// `getSession()` resolving to `null` when signed out and `onAuthStateChange`
// returning a `{ data: { subscription: { unsubscribe } } }` handle.
import { apiPost, getToken, setToken, clearToken } from './apiClient'

const listeners = new Set()

function decodeJwt(token) {
  try {
    const [, payloadB64] = token.split('.')
    const normalized = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function buildSession(token) {
  if (!token) return null

  const payload = decodeJwt(token)
  if (!payload) return null
  if (payload.exp && Date.now() >= payload.exp * 1000) return null

  return {
    access_token: token,
    expires_at: payload.exp,
    user: { id: payload.sub, email: payload.email },
  }
}

function notify(session) {
  listeners.forEach((callback) => {
    try {
      callback(session)
    } catch {
      // a listener throwing shouldn't break the others
    }
  })
}

export async function signInWithPassword({ email, password }) {
  const { data, error } = await apiPost('/api/auth/login', { email, password })

  if (error || !data?.token) {
    return { data: null, error: error || new Error('Login failed') }
  }

  setToken(data.token)
  const session = buildSession(data.token)
  notify(session)

  return { data: { session, user: session?.user ?? null }, error: null }
}

export async function signOut() {
  clearToken()
  notify(null)

  try {
    await apiPost('/api/auth/logout', {})
  } catch {
    // logout is stateless server-side — nothing to retry.
  }
}

export async function getSession() {
  const token = getToken()
  const session = buildSession(token)

  if (!session && token) {
    // Stored token is missing/expired/malformed — clear it so future calls
    // don't keep re-decoding a dead token.
    clearToken()
  }

  return session
}

export function onAuthStateChange(callback) {
  listeners.add(callback)

  function handleStorage(event) {
    if (event.key && event.key !== 'ghlprime_admin_token') return
    getSession().then(callback)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage)
  }

  return {
    data: {
      subscription: {
        unsubscribe() {
          listeners.delete(callback)
          if (typeof window !== 'undefined') {
            window.removeEventListener('storage', handleStorage)
          }
        },
      },
    },
  }
}
