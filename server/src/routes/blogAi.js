import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler, sendError } from '../utils/asyncHandler.js'
import { decryptToken } from '../utils/tokenCrypto.js'
import { getSettings, saveSettings, runBlogAiEngine } from '../lib/blogAiEngine.js'
import { testClaudeAccount, testCodexConnection, codexLoginStatus, codexLogout } from '../lib/aiCliRunner.js'
import { ACCOUNT_SAFE_COLUMNS, saveClaudeAccount } from '../lib/blogAiAccountRepo.js'
import { getConnectSession, destroyConnectSession, publicConnectSession } from '../lib/connectSessions.js'
import { startClaudeConnectSession, submitClaudeConnectCode, startCodexConnectSession } from '../lib/blogAiConnect.js'


async function testSingleClaudeAccount(account, settings) {
  let token
  try {
    token = decryptToken(account.token)
  } catch (error) {
    return { ok: false, message: `Could not decrypt stored token: ${error.message}` }
  }

  return testClaudeAccount({
    token,
    model: account.model || settings.claude_model || undefined,
    authType: account.auth_type,
    cliPath: settings.claude_cli_command || undefined,
  })
}

export default function registerBlogAiRoutes(app) {
  const router = express.Router()

  // -- Settings -----------------------------------------------------------

  router.get('/settings', requireAuth, asyncHandler(async (_req, res) => {
    res.json(await getSettings())
  }))

  router.put('/settings', requireAuth, asyncHandler(async (req, res) => {
    res.json(await saveSettings(req.body || {}))
  }))

  // -- Claude accounts ------------------------------------------------------

  router.get('/accounts', requireAuth, asyncHandler(async (_req, res) => {
    const { rows } = await pool.query(
      `select ${ACCOUNT_SAFE_COLUMNS} from blog_ai_accounts where provider = 'claude' order by created_at asc`,
    )
    res.json(rows)
  }))

  router.post('/accounts', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    let account
    try {
      account = await saveClaudeAccount({
        label: p.label,
        rawToken: p.token,
        model: p.model || null,
        
        authType: p.auth_type === 'api_key' ? 'api_key' : 'oauth',
      })
    } catch (error) {
      return sendError(res, 400, error.message)
    }
    res.status(201).json(account)
  }))

  // Enable/disable/label/model updates only — token rotation is deliberately
  // not supported here. To rotate a token, delete and recreate the account.
  router.put('/accounts/:id', requireAuth, asyncHandler(async (req, res) => {
    const p = req.body || {}
    const { rows } = await pool.query(
      `update blog_ai_accounts set
         label = coalesce($1, label),
         model = coalesce($2, model),
         enabled = coalesce($3, enabled)
       where id = $4 and provider = 'claude'
       returning ${ACCOUNT_SAFE_COLUMNS}`,
      [
        p.label ? String(p.label).trim() : null,
        p.model ?? null,
        typeof p.enabled === 'boolean' ? p.enabled : null,
        req.params.id,
      ],
    )
    if (!rows[0]) return sendError(res, 404, 'Account not found')
    res.json(rows[0])
  }))

  router.delete('/accounts/:id', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `delete from blog_ai_accounts where id = $1 and provider = 'claude' returning id`,
      [req.params.id],
    )
    if (!rows.length) return sendError(res, 404, 'Account not found')
    res.json({ success: true })
  }))

  router.post('/accounts/:id/test', requireAuth, asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `select * from blog_ai_accounts where id = $1 and provider = 'claude'`,
      [req.params.id],
    )
    const account = rows[0]
    if (!account) return sendError(res, 404, 'Account not found')

    const settings = await getSettings()
    res.json(await testSingleClaudeAccount(account, settings))
  }))

  // "Test all (say hi)" on the AI Connections page -- tests every enabled
  // Claude account concurrently instead of one at a time. Reuses
  // testSingleClaudeAccount() (the same per-account logic as the single
  // /accounts/:id/test route above) so there's exactly one place that knows
  // how to test an account; each account is wrapped in its own try/catch so
  // one failing account can't reject the whole Promise.all.
  router.post('/accounts/test-all', requireAuth, asyncHandler(async (_req, res) => {
    const settings = await getSettings()
    const { rows: accounts } = await pool.query(
      `select * from blog_ai_accounts where provider = 'claude' and enabled = true order by created_at asc`,
    )

    const results = await Promise.all(accounts.map(async (account) => {
      try {
        const result = await testSingleClaudeAccount(account, settings)
        return { accountId: account.id, label: account.label, ok: result.ok, message: result.message }
      } catch (error) {
        return { accountId: account.id, label: account.label, ok: false, message: error?.message || String(error) }
      }
    }))

    res.json(results)
  }))

  // -- Claude "connect from this browser" (no SSH, no local CLI) ------------
  //
  // Runs `claude setup-token` in a pty on the server, surfaces the OAuth
  // authorize URL it prints, accepts the resulting code, and — once the pty
  // exits successfully — saves the captured token via the exact same
  // saveClaudeAccount() used by the manual paste-token endpoint above. See
  // lib/blogAiConnect.js for the actual parsing/orchestration.

  router.post('/accounts/connect/claude/start', requireAuth, asyncHandler(async (req, res) => {
    const label = String((req.body || {}).label || '').trim()
    if (!label) return sendError(res, 400, 'Label is required')

    const session = startClaudeConnectSession({ label })
    res.status(201).json({ sessionId: session.id })
  }))

  router.get('/accounts/connect/claude/:sessionId', requireAuth, asyncHandler(async (req, res) => {
    const session = getConnectSession(req.params.sessionId)
    if (!session) return sendError(res, 404, 'Connect session not found or expired')
    res.json(publicConnectSession(session))
  }))

  router.post('/accounts/connect/claude/:sessionId/code', requireAuth, asyncHandler(async (req, res) => {
    try {
      submitClaudeConnectCode(req.params.sessionId, (req.body || {}).code)
    } catch (error) {
      return sendError(res, 400, error.message)
    }
    res.json(publicConnectSession(getConnectSession(req.params.sessionId)))
  }))

  router.delete('/accounts/connect/claude/:sessionId', requireAuth, asyncHandler(async (req, res) => {
    destroyConnectSession(req.params.sessionId)
    res.json({ success: true })
  }))

  // -- Codex (single ambient-login connection, no accounts table rows) ------

  router.post('/codex/test', requireAuth, asyncHandler(async (_req, res) => {
    const settings = await getSettings()
    res.json(await testCodexConnection({ model: settings.codex_model, cliPath: settings.codex_cli_command || undefined }))
  }))

  // "Connect from this browser" — `codex login --device-auth` prints a URL
  // + one-time code and polls on its own until the admin approves in their
  // browser, so unlike Claude there's nothing to submit back; the frontend
  // just polls GET .../:sessionId until status is 'success'.
  router.post('/codex/connect/start', requireAuth, asyncHandler(async (_req, res) => {
    const session = startCodexConnectSession()
    res.status(201).json({ sessionId: session.id })
  }))

  router.get('/codex/connect/:sessionId', requireAuth, asyncHandler(async (req, res) => {
    const session = getConnectSession(req.params.sessionId)
    if (!session) return sendError(res, 404, 'Connect session not found or expired')
    res.json(publicConnectSession(session))
  }))

  router.delete('/codex/connect/:sessionId', requireAuth, asyncHandler(async (req, res) => {
    destroyConnectSession(req.params.sessionId)
    res.json({ success: true })
  }))

  router.get('/codex/status', requireAuth, asyncHandler(async (_req, res) => {
    const settings = await getSettings()
    res.json(await codexLoginStatus(settings.codex_cli_command || undefined))
  }))

  router.post('/codex/disconnect', requireAuth, asyncHandler(async (_req, res) => {
    const settings = await getSettings()
    res.json(await codexLogout(settings.codex_cli_command || undefined))
  }))

  // -- Runs -------------------------------------------------------------------

  router.post('/run-now', requireAuth, asyncHandler(async (_req, res) => {
    const result = await runBlogAiEngine()
    if (result.started === false) return sendError(res, 409, result.reason)
    res.json(result)
  }))

  router.get('/runs', requireAuth, asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 50, 200)
    const { rows } = await pool.query(
      `select r.*, b.title as blog_post_title, b.slug as blog_post_slug, b.published as blog_post_published
       from blog_ai_runs r
       left join blog_posts b on b.id = r.blog_post_id
       order by r.started_at desc
       limit $1`,
      [limit],
    )
    res.json(rows)
  }))

  app.use('/api/admin/blog-ai', router)
}
