import { pool } from '../db.js'
import { encryptToken } from '../utils/tokenCrypto.js'

// Columns safe to return to the admin UI. The encrypted `token` column is
// NEVER included in any list/get response — only `token_preview` (the last
// 4 chars of the raw token, captured once here before encryption).
export const ACCOUNT_SAFE_COLUMNS = `
  id, provider, label, token_preview, model, auth_type, enabled, status,
  cooldown_until, done_count, failed_count, last_used_at, last_error, created_at
`

// Shared account-creation logic for every way an admin can add a Claude
// account: pasting an already-generated token by hand (routes/blogAi.js's
// POST /accounts, the tested SSH-based fallback), the browser-based
// "Connect a Claude account" pty flow (blogAiConnect.js, which captures the
// token automatically from `claude setup-token`'s own output — always
// authType 'oauth'), and the advanced "use an API key instead" inline row
// on the AI Connections page (authType 'api_key'). All three end up with a
// raw secret string (an OAuth token or an API key) that gets encrypted +
// inserted identically, only `auth_type` differs, so this is the single
// place that does it rather than duplicating the insert three times.
export async function saveClaudeAccount({ label, rawToken, model, authType = 'oauth' }) {
  const cleanLabel = String(label || '').trim()
  const cleanToken = typeof rawToken === 'string' ? rawToken.trim() : ''
  const cleanAuthType = authType === 'api_key' ? 'api_key' : 'oauth'

  if (!cleanLabel) throw new Error('Label is required')
  if (!cleanToken) throw new Error(cleanAuthType === 'api_key' ? 'API key is required' : 'Token is required')

  const tokenPreview = cleanToken.slice(-4)
  const encryptedToken = encryptToken(cleanToken)

  const { rows } = await pool.query(
    `insert into blog_ai_accounts (provider, label, token, token_preview, model, auth_type, enabled)
     values ('claude', $1, $2, $3, $4, $5, true)
     returning ${ACCOUNT_SAFE_COLUMNS}`,
    [cleanLabel, encryptedToken, tokenPreview, model || null, cleanAuthType],
  )
  return rows[0]
}
