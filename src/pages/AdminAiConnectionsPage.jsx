import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bot, ChevronRight, ExternalLink, Loader2, Plug, RefreshCw, Trash2,
} from 'lucide-react'
import AdminShell from '../components/AdminShell'
import Modal from '../components/admin/Modal'
import { getSession, signOut } from '../lib/auth'
import { fetchBlogAiSettings, saveBlogAiSettings } from '../lib/blogAiApi'
import {
  cancelClaudeConnect,
  cancelCodexConnect,
  createBlogAiAccount,
  deleteBlogAiAccount,
  disconnectCodex,
  fetchBlogAiAccounts,
  fetchClaudeConnectStatus,
  fetchCodexConnectStatus,
  fetchCodexStatus,
  startClaudeConnect,
  startCodexConnect,
  submitClaudeConnectCode,
  testAllBlogAiAccounts,
  testBlogAiAccount,
  testCodexConnection,
  updateBlogAiAccount,
} from '../lib/aiConnectionsApi'
import '../styles/admin-extras.css'

// AI Connections every Claude/Codex account-connection concern lives here
// now, split off of AdminBlogAiPage.jsx (which keeps only the blog-writing
// settings, Run Now, and Recent Runs) per the customer's "can we put this
// under a different menu, maybe in settings?" request.

const initialClaudeSettingsForm = { claude_model: '', claude_cli_command: '' }
const initialCodexSettingsForm = { codex_enabled: false, codex_model: '', codex_cli_command: '' }
const initialAccountForm = { label: '', token: '' }
const initialApiKeyForm = { label: '', apiKey: '' }
const initialClaudeConnectState = { sessionId: null, status: null, url: null, message: null, label: '' }
const initialCodexConnectState = { sessionId: null, status: null, url: null, code: null, message: null }

const CONNECT_POLL_INTERVAL_MS = 1500

// CLI aliases the installed `claude` binary already understands (see the
// `--model` usage in server/src/lib/aiCliRunner.js) -- an empty value omits
// `--model` entirely so the CLI/plan picks its own default.
const CLAUDE_MODEL_OPTIONS = [
  { value: '', label: 'Default (let the plan choose)' },
  { value: 'sonnet', label: 'Sonnet fast, balanced (recommended)' },
  { value: 'opus', label: 'Opus most capable, best for complex posts' },
  { value: 'haiku', label: 'Haiku fastest and cheapest' },
]

function mapSettingsToClaudeForm(settings) {
  return {
    claude_model: settings.claude_model || '',
    claude_cli_command: settings.claude_cli_command || '',
  }
}

function mapSettingsToCodexForm(settings) {
  return {
    codex_enabled: Boolean(settings.codex_enabled),
    codex_model: settings.codex_model || '',
    codex_cli_command: settings.codex_cli_command || '',
  }
}

function formatDateTime(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function isInCooldown(account) {
  return Boolean(account.cooldown_until) && new Date(account.cooldown_until) > new Date()
}

function StatusDot({ account }) {
  let colorClass = 'is-enabled'
  if (!account.enabled) colorClass = 'is-disabled'
  else if (isInCooldown(account)) colorClass = 'is-cooldown'
  return <span className={`connector-status-dot ${colorClass}`} aria-hidden="true" />
}

function TestResultNote({ result }) {
  if (!result) return null
  if (result.loading) return <span className="char-counter">Testing…</span>
  if (!result.data) return <span className="char-counter" style={{ color: '#ffb0b0' }}>{result.error || 'Test failed'}</span>

  const { ok, message } = result.data
  return (
    <span className="char-counter" style={{ color: ok ? '#8df0c7' : '#ffb0b0' }}>
      {ok ? 'OK' : 'Failed'}{message ? ` ${message}` : ''}
    </span>
  )
}

export default function AdminAiConnectionsPage() {
  const [session, setSession] = useState(undefined)
  const [status, setStatus] = useState(null) // { type: 'status' | 'error', message }
  const [accounts, setAccounts] = useState([])
  const [testResults, setTestResults] = useState({}) // keyed by account id, or "codex"
  const [testingAll, setTestingAll] = useState(false)

  const [claudeSettingsForm, setClaudeSettingsForm] = useState(initialClaudeSettingsForm)
  const [savingClaudeSettings, setSavingClaudeSettings] = useState(false)

  const [accountForm, setAccountForm] = useState(initialAccountForm)
  const [savingAccount, setSavingAccount] = useState(false)
  const [apiKeyForm, setApiKeyForm] = useState(initialApiKeyForm)
  const [savingApiKeyAccount, setSavingApiKeyAccount] = useState(false)

  // -- Claude "connect from this browser" (no SSH) -------------------------
  const [showClaudeConnectModal, setShowClaudeConnectModal] = useState(false)
  const [claudeConnect, setClaudeConnect] = useState(initialClaudeConnectState)
  const [claudeConnectCode, setClaudeConnectCode] = useState('')
  const [startingClaudeConnect, setStartingClaudeConnect] = useState(false)
  const [submittingClaudeCode, setSubmittingClaudeCode] = useState(false)

  // -- Codex --------------------------------------------------------------
  const [codexSettingsForm, setCodexSettingsForm] = useState(initialCodexSettingsForm)
  const [savingCodexSettings, setSavingCodexSettings] = useState(false)
  const [showCodexConnectModal, setShowCodexConnectModal] = useState(false)
  const [codexConnect, setCodexConnect] = useState(initialCodexConnectState)
  const [codexStatus, setCodexStatus] = useState(null) // { loggedIn, raw }
  const [disconnectingCodex, setDisconnectingCodex] = useState(false)

  useEffect(() => {
    getSession().then(setSession)
    fetchBlogAiSettings().then(({ data }) => {
      if (data) {
        setClaudeSettingsForm(mapSettingsToClaudeForm(data))
        setCodexSettingsForm(mapSettingsToCodexForm(data))
      }
    })
    fetchBlogAiAccounts().then(({ data }) => { if (Array.isArray(data)) setAccounts(data) })
    fetchCodexStatus().then(({ data }) => { if (data) setCodexStatus(data) })
  }, [])

  // Polls the Claude connect session while it's in-flight; stops as soon as
  // it resolves to success/failed (or there's no session at all).
  useEffect(() => {
    if (!claudeConnect.sessionId) return undefined
    if (claudeConnect.status === 'success' || claudeConnect.status === 'failed') return undefined

    const interval = setInterval(async () => {
      const { data, error } = await fetchClaudeConnectStatus(claudeConnect.sessionId)
      if (error) {
        setClaudeConnect((current) => ({ ...current, status: 'failed', message: error.message }))
        return
      }
      setClaudeConnect((current) => ({ ...current, ...data }))
      if (data.status === 'success' && data.account) {
        setAccounts((current) => [...current, data.account])
        setStatus({ type: 'status', message: 'Claude account connected.' })
      }
    }, CONNECT_POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [claudeConnect.sessionId, claudeConnect.status])

  // Same idea for the Codex device-auth session no code to submit back,
  // just poll until it resolves on its own.
  useEffect(() => {
    if (!codexConnect.sessionId) return undefined
    if (codexConnect.status === 'success' || codexConnect.status === 'failed') return undefined

    const interval = setInterval(async () => {
      const { data, error } = await fetchCodexConnectStatus(codexConnect.sessionId)
      if (error) {
        setCodexConnect((current) => ({ ...current, status: 'failed', message: error.message }))
        return
      }
      setCodexConnect((current) => ({ ...current, ...data }))
      if (data.status === 'success') {
        fetchCodexStatus().then(({ data: statusData }) => { if (statusData) setCodexStatus(statusData) })
        setStatus({ type: 'status', message: 'Codex account connected.' })
      }
    }, CONNECT_POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [codexConnect.sessionId, codexConnect.status])

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  // -- Claude panel-level settings (Model + Advanced CLI command) ----------

  async function handleSaveClaudeSettings() {
    setSavingClaudeSettings(true)
    setStatus(null)

    const { data, error } = await saveBlogAiSettings({
      claude_model: claudeSettingsForm.claude_model,
      claude_cli_command: claudeSettingsForm.claude_cli_command || null,
    })

    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to save Claude settings' })
      setSavingClaudeSettings(false)
      return
    }

    setClaudeSettingsForm(mapSettingsToClaudeForm(data))
    setStatus({ type: 'status', message: 'Claude connector settings saved.' })
    setSavingClaudeSettings(false)
  }

  // -- Claude accounts ------------------------------------------------------

  async function handleAddAccount(event) {
    event.preventDefault()
    setSavingAccount(true)
    setStatus(null)

    const { data, error } = await createBlogAiAccount({
      label: accountForm.label,
      token: accountForm.token,
      model: null,
      authType: 'oauth',
    })

    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to add account' })
      setSavingAccount(false)
      return
    }

    setAccounts((current) => [...current, data])
    setAccountForm(initialAccountForm)
    setSavingAccount(false)
    setStatus({ type: 'status', message: 'Claude account added.' })
  }

  async function handleAddApiKeyAccount(event) {
    event.preventDefault()
    setSavingApiKeyAccount(true)
    setStatus(null)

    const { data, error } = await createBlogAiAccount({
      label: apiKeyForm.label,
      token: apiKeyForm.apiKey,
      model: null,
      authType: 'api_key',
    })

    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to add account' })
      setSavingApiKeyAccount(false)
      return
    }

    setAccounts((current) => [...current, data])
    setApiKeyForm(initialApiKeyForm)
    setSavingApiKeyAccount(false)
    setStatus({ type: 'status', message: 'Claude account added (API key).' })
  }

  async function handleToggleAccount(account) {
    setStatus(null)
    const { data, error } = await updateBlogAiAccount(account.id, { enabled: !account.enabled })
    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to update account' })
      return
    }
    setAccounts((current) => current.map((item) => (item.id === account.id ? data : item)))
  }

  async function handleDeleteAccount(account) {
    if (!window.confirm(`Delete Claude account "${account.label}"? This cannot be undone.`)) return
    setStatus(null)
    const { error } = await deleteBlogAiAccount(account.id)
    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to delete account' })
      return
    }
    setAccounts((current) => current.filter((item) => item.id !== account.id))
  }

  async function handleTestAccount(account) {
    setTestResults((current) => ({ ...current, [account.id]: { loading: true } }))
    const { data, error } = await testBlogAiAccount(account.id)
    setTestResults((current) => ({
      ...current,
      [account.id]: error ? { loading: false, error: error.message } : { loading: false, data },
    }))
  }

  async function handleTestAllAccounts() {
    const enabledAccounts = accounts.filter((account) => account.enabled)
    if (!enabledAccounts.length) {
      setStatus({ type: 'error', message: 'No enabled Claude accounts to test.' })
      return
    }

    setTestingAll(true)
    setStatus(null)
    setTestResults((current) => {
      const next = { ...current }
      enabledAccounts.forEach((account) => { next[account.id] = { loading: true } })
      return next
    })

    const { data, error } = await testAllBlogAiAccounts()

    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to test accounts' })
      setTestingAll(false)
      return
    }

    setTestResults((current) => {
      const next = { ...current }
      ;(data || []).forEach((result) => {
        next[result.accountId] = { loading: false, data: { ok: result.ok, message: result.message } }
      })
      return next
    })
    setTestingAll(false)
  }

  // -- Claude "connect from this browser" (no SSH) -------------------------

  function openClaudeConnectModal() {
    setClaudeConnect(initialClaudeConnectState)
    setClaudeConnectCode('')
    setShowClaudeConnectModal(true)
  }

  async function handleStartClaudeConnect(event) {
    event.preventDefault()
    setStartingClaudeConnect(true)

    const { data, error } = await startClaudeConnect(claudeConnect.label)

    if (error) {
      setClaudeConnect((current) => ({ ...current, status: 'failed', message: error.message }))
      setStartingClaudeConnect(false)
      return
    }

    setClaudeConnect((current) => ({ ...current, sessionId: data.sessionId, status: 'starting' }))
    setStartingClaudeConnect(false)
  }

  async function handleSubmitClaudeConnectCode(event) {
    event.preventDefault()
    setSubmittingClaudeCode(true)

    const { error } = await submitClaudeConnectCode(claudeConnect.sessionId, claudeConnectCode)

    if (error) {
      setClaudeConnect((current) => ({ ...current, status: 'failed', message: error.message }))
    } else {
      setClaudeConnect((current) => ({ ...current, status: 'verifying' }))
    }
    setSubmittingClaudeCode(false)
  }

  function handleRetryClaudeConnect() {
    setClaudeConnect(initialClaudeConnectState)
    setClaudeConnectCode('')
  }

  async function handleCloseClaudeConnectModal() {
    const { sessionId } = claudeConnect
    setShowClaudeConnectModal(false)
    setClaudeConnect(initialClaudeConnectState)
    if (sessionId) await cancelClaudeConnect(sessionId)
  }

  // -- Codex ----------------------------------------------------------------

  async function handleSaveCodexSettings() {
    setSavingCodexSettings(true)
    setStatus(null)

    const { data, error } = await saveBlogAiSettings({
      codex_enabled: codexSettingsForm.codex_enabled,
      codex_model: codexSettingsForm.codex_model,
      codex_cli_command: codexSettingsForm.codex_cli_command || null,
    })

    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to save Codex settings' })
      setSavingCodexSettings(false)
      return
    }

    setCodexSettingsForm(mapSettingsToCodexForm(data))
    setStatus({ type: 'status', message: 'Codex settings saved.' })
    setSavingCodexSettings(false)
  }

  async function handleStartCodexConnect() {
    setShowCodexConnectModal(true)
    setCodexConnect({ ...initialCodexConnectState, status: 'starting' })

    const { data, error } = await startCodexConnect()

    if (error) {
      setCodexConnect((current) => ({ ...current, status: 'failed', message: error.message }))
      return
    }

    setCodexConnect((current) => ({ ...current, sessionId: data.sessionId, status: 'starting' }))
  }

  async function handleCloseCodexConnectModal() {
    const { sessionId } = codexConnect
    setShowCodexConnectModal(false)
    setCodexConnect(initialCodexConnectState)
    if (sessionId) await cancelCodexConnect(sessionId)
  }

  async function handleDisconnectCodex() {
    setDisconnectingCodex(true)
    setStatus(null)

    const { data, error } = await disconnectCodex()

    if (error || (data && data.ok === false)) {
      setStatus({ type: 'error', message: (data && data.message) || (error && error.message) || 'Failed to disconnect' })
    } else {
      setStatus({ type: 'status', message: (data && data.message) || 'Disconnected.' })
      const { data: statusData } = await fetchCodexStatus()
      if (statusData) setCodexStatus(statusData)
    }
    setDisconnectingCodex(false)
  }

  async function handleTestCodex() {
    setTestResults((current) => ({ ...current, codex: { loading: true } }))
    const { data, error } = await testCodexConnection()
    setTestResults((current) => ({
      ...current,
      codex: error ? { loading: false, error: error.message } : { loading: false, data },
    }))
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading AI Connections...">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><Plug size={16} /> AI Connections</span>
          <h1>Connect and manage the Claude / Codex logins Auto Blog writes with.</h1>
          <p>Blog-writing settings live on the Auto Blog page this page is only about connecting and testing accounts.</p>
        </div>
        <div className="admin-top-actions">
          <Link to="/admin/blog-ai" className="secondary-pill">Auto Blog</Link>
        </div>
      </div>

      {status ? <div className={status.type === 'error' ? 'form-error' : 'form-status'}>{status.message}</div> : null}

      <div className="admin-form-card futuristic-card refined-admin-card">
        <div className="admin-card-head">
          <h2>Claude connector</h2>
        </div>
        <p className="admin-empty-note">
          No primary account connect one or more Claude accounts and the system uses them all equally, one after
          another (serial rotation), moving to the next whenever one is busy or hits its limit.
        </p>

        <div className="admin-form-grid">
          <label>
            <span>Model</span>
            <select
              value={claudeSettingsForm.claude_model}
              onChange={(event) => setClaudeSettingsForm((current) => ({ ...current, claude_model: event.target.value }))}
            >
              {CLAUDE_MODEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="connector-howto-box">
          <strong>How to connect an account</strong>
          <ul>
            <li>Easiest: click Connect in browser below, sign into the account, approve, and paste the code back nothing to install.</li>
            <li>Or on any computer run <code>claude setup-token</code> logged into that account, copy the token, and paste it in the token box.</li>
            <li>
              Accounts are used in rotation; a failing or exhausted account is parked in cooldown for about 20
              minutes before the engine tries it again. If every Claude account is exhausted, generation
              automatically falls back to Codex (when enabled below).
            </li>
          </ul>
        </div>

        <div className="admin-card-head admin-section-head connector-accounts-head">
          <div>
            <h2>Claude accounts</h2>
            <span className="admin-list-meta">every account is used in turn the system auto-switches when one hits its limit</span>
          </div>
          <button type="button" className="team-edit-btn" onClick={handleTestAllAccounts} disabled={testingAll}>
            {testingAll ? <><Loader2 size={14} className="admin-spin" /> Testing all...</> : <><RefreshCw size={14} /> Test all (say hi)</>}
          </button>
        </div>

        <div className="admin-study-list connector-account-list">
          {accounts.map((account) => (
            <article key={account.id} className="connector-account-row">
              <div className="connector-account-main">
                <div className="connector-account-line">
                  <StatusDot account={account} />
                  <strong>{account.label}</strong>
                  <span className="connector-account-token">token •••• {account.token_preview || '????'}</span>
                  {account.auth_type === 'api_key' ? <span className="connector-account-tag">API key</span> : null}
                </div>
                <small className="connector-account-meta">
                  {account.enabled ? 'enabled' : 'disabled'}
                  {account.status && account.status !== 'idle' ? ` · ${account.status}` : ''}
                  {' · '}{account.done_count || 0} done / {account.failed_count || 0} failed
                  {isInCooldown(account) ? ` · cooldown until ${formatDateTime(account.cooldown_until)}` : ''}
                </small>
                {account.last_error ? <small style={{ color: '#ffb0b0' }}>Last error: {account.last_error}</small> : null}
              </div>
              <div className="admin-study-actions connector-account-actions">
                <button type="button" className="team-edit-btn" onClick={() => handleTestAccount(account)}>
                  <RefreshCw size={14} /> Test
                </button>
                <button type="button" className="team-edit-btn" onClick={() => handleToggleAccount(account)}>
                  {account.enabled ? 'Disable' : 'Enable'}
                </button>
                <button type="button" className="team-edit-btn admin-danger-btn" onClick={() => handleDeleteAccount(account)}>
                  <Trash2 size={15} /> Delete
                </button>
                <TestResultNote result={testResults[account.id]} />
              </div>
            </article>
          ))}
          {accounts.length === 0 ? (
            <p className="admin-empty-note">No Claude accounts yet. Add one below, or enable Codex as a fallback.</p>
          ) : null}
        </div>

        <form className="connector-inline-row" onSubmit={handleAddAccount}>
          <input
            className="connector-inline-input"
            value={accountForm.label}
            onChange={(event) => setAccountForm((current) => ({ ...current, label: event.target.value }))}
            placeholder="Label (e.g. Primary account)"
            required
          />
          <input
            className="connector-inline-input connector-inline-input-wide"
            value={accountForm.token}
            onChange={(event) => setAccountForm((current) => ({ ...current, token: event.target.value }))}
            placeholder="OAuth token (from claude setup-token)"
            required
          />
          <button className="team-edit-btn primary" type="submit" disabled={savingAccount}>
            {savingAccount ? 'Adding...' : 'Add account'}
          </button>
        </form>

        <div className="connector-connect-row">
          <button type="button" className="admin-add-trigger" onClick={openClaudeConnectModal}>
            <Plug size={16} /> Connect in browser
          </button>
          <button type="button" className="primary-pill" onClick={handleSaveClaudeSettings} disabled={savingClaudeSettings}>
            {savingClaudeSettings ? 'Saving...' : 'Save'}
          </button>
        </div>

        <details className="connector-advanced">
          <summary><ChevronRight size={14} className="connector-advanced-chevron" /> Advanced · CLI command</summary>
          <div className="connector-advanced-body">
            <p className="admin-empty-note">
              Override the raw <code>claude</code> binary this feature shells out to. Leave blank to use the
              server&rsquo;s default (or the <code>CLAUDE_CLI_PATH</code> environment variable, if set).
            </p>
            <label>
              <span>Claude CLI command</span>
              <input
                value={claudeSettingsForm.claude_cli_command}
                onChange={(event) => setClaudeSettingsForm((current) => ({ ...current, claude_cli_command: event.target.value }))}
                placeholder="/usr/bin/claude"
              />
            </label>
          </div>
        </details>

        <details className="connector-advanced">
          <summary>▶ Advanced: use API keys instead of a subscription</summary>
          <div className="connector-advanced-body connector-advanced-apikey">
            <p className="admin-empty-note">
              Every account above uses your Claude Code subscription login. This is an additional, opt-in path for
              an account authenticated with a plain <strong>Anthropic API key</strong> instead not a Claude Code
              token.
            </p>
            <form className="connector-inline-row connector-inline-row-muted" onSubmit={handleAddApiKeyAccount}>
              <input
                className="connector-inline-input"
                value={apiKeyForm.label}
                onChange={(event) => setApiKeyForm((current) => ({ ...current, label: event.target.value }))}
                placeholder="Label (e.g. API-key account)"
                required
              />
              <input
                className="connector-inline-input connector-inline-input-wide"
                value={apiKeyForm.apiKey}
                onChange={(event) => setApiKeyForm((current) => ({ ...current, apiKey: event.target.value }))}
                placeholder="Anthropic API key (sk-ant-api03-...)"
                required
              />
              <button className="team-edit-btn" type="submit" disabled={savingApiKeyAccount}>
                {savingApiKeyAccount ? 'Adding...' : 'Add account'}
              </button>
            </form>
          </div>
        </details>
      </div>

      <Modal open={showClaudeConnectModal} onClose={handleCloseClaudeConnectModal} title="Connect a Claude Account">
        <div className="admin-form-card futuristic-card refined-admin-card">
          <div className="admin-card-head">
            <h2>Connect from this browser</h2>
            <span><Bot size={15} /> No SSH and no CLI on your own machine</span>
          </div>
          <p className="admin-empty-note">
            We start sign-in on the server, you authorize on claude.com, and paste the code back.
          </p>

          {claudeConnect.status === null ? (
            <form className="admin-form-grid" onSubmit={handleStartClaudeConnect}>
              <label className="full-width">
                <span>Label</span>
                <input
                  value={claudeConnect.label}
                  onChange={(event) => setClaudeConnect((current) => ({ ...current, label: event.target.value }))}
                  placeholder="Primary account"
                  required
                />
              </label>
              <div className="team-edit-actions admin-form-actions full-width">
                <button className="primary-pill large auth-submit" type="submit" disabled={startingClaudeConnect}>
                  {startingClaudeConnect ? 'Starting...' : 'Connect a Claude account'}
                </button>
              </div>
            </form>
          ) : null}

          {claudeConnect.status === 'starting' ? (
            <p className="char-counter"><Loader2 size={14} className="admin-spin" /> Starting sign-in on the server…</p>
          ) : null}

          {claudeConnect.status === 'awaiting_code' ? (
            <>
              <p className="admin-empty-note">Open this link, log in on claude.com, then paste the resulting code below.</p>
              <p>
                <a href={claudeConnect.url} target="_blank" rel="noreferrer" className="text-link admin-open-link">
                  {claudeConnect.url} <ExternalLink size={13} />
                </a>
              </p>
              <form className="admin-form-grid" onSubmit={handleSubmitClaudeConnectCode}>
                <label className="full-width">
                  <span>Authorization code</span>
                  <input
                    value={claudeConnectCode}
                    onChange={(event) => setClaudeConnectCode(event.target.value)}
                    placeholder="Paste the code from claude.com"
                    required
                  />
                </label>
                <div className="team-edit-actions admin-form-actions full-width">
                  <button className="primary-pill large auth-submit" type="submit" disabled={submittingClaudeCode}>
                    {submittingClaudeCode ? 'Submitting...' : 'Submit code'}
                  </button>
                </div>
              </form>
            </>
          ) : null}

          {claudeConnect.status === 'verifying' ? (
            <p className="char-counter"><Loader2 size={14} className="admin-spin" /> Verifying code…</p>
          ) : null}

          {claudeConnect.status === 'success' ? (
            <>
              <p className="form-status">Connected account added.</p>
              <div className="team-edit-actions admin-form-actions">
                <button type="button" className="primary-pill large auth-submit" onClick={handleCloseClaudeConnectModal}>
                  Done
                </button>
              </div>
            </>
          ) : null}

          {claudeConnect.status === 'failed' ? (
            <>
              <p className="form-error">{claudeConnect.message || 'Connection failed.'}</p>
              <div className="team-edit-actions admin-form-actions">
                <button type="button" className="team-edit-btn" onClick={handleRetryClaudeConnect}>Try Again</button>
                <button type="button" className="team-edit-btn admin-danger-btn" onClick={handleCloseClaudeConnectModal}>
                  Cancel
                </button>
              </div>
            </>
          ) : null}
        </div>
      </Modal>

      <div className="admin-form-card futuristic-card refined-admin-card">
        <div className="admin-card-head">
          <h2>Codex (fallback provider)</h2>
          <span>Used only when no Claude account is available</span>
        </div>

        <div className="admin-form-grid">
          <div className="full-width admin-team-assignment-box refined-assignment-box">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={codexSettingsForm.codex_enabled}
                onChange={(event) => setCodexSettingsForm((current) => ({ ...current, codex_enabled: event.target.checked }))}
              />
              <span>Enable Codex as a fallback</span>
            </label>
            <p className="admin-empty-note">
              Codex uses a single ambient <code>codex login --device-auth</code> session there&rsquo;s no per-account
              token to paste here. Connect from this browser below, or run <code>codex login --device-auth</code> over
              SSH yourself. Use Test Connection to check whether the login is still valid.
            </p>
          </div>

          <label className="full-width">
            <span>Codex model</span>
            <input
              value={codexSettingsForm.codex_model}
              onChange={(event) => setCodexSettingsForm((current) => ({ ...current, codex_model: event.target.value }))}
              placeholder="Leave blank to use the account's default model"
            />
          </label>
        </div>

        <p className="admin-empty-note">
          <strong>Connect from this browser:</strong> sign in with your ChatGPT plan using a one-time code. No SSH,
          and nothing to paste back approve it in your browser and this page notices on its own.
        </p>
        <div className="admin-study-actions">
          <button type="button" className="admin-add-trigger" onClick={handleStartCodexConnect}>
            <Plug size={16} /> Connect a ChatGPT account
          </button>
          {codexStatus?.loggedIn ? (
            <button
              type="button"
              className="team-edit-btn admin-danger-btn"
              onClick={handleDisconnectCodex}
              disabled={disconnectingCodex}
            >
              <Trash2 size={15} /> {disconnectingCodex ? 'Disconnecting...' : 'Disconnect'}
            </button>
          ) : null}
        </div>
        <p className="char-counter">
          {codexStatus
            ? (codexStatus.loggedIn ? `Connected · ChatGPT · ${codexStatus.raw}` : (codexStatus.raw || 'Not connected'))
            : 'Checking status…'}
        </p>

        <div className="admin-study-actions">
          <button type="button" className="team-edit-btn" onClick={handleTestCodex}>
            <RefreshCw size={14} /> Test Connection
          </button>
          <TestResultNote result={testResults.codex} />
        </div>

        <div className="connector-connect-row">
          <button type="button" className="primary-pill" onClick={handleSaveCodexSettings} disabled={savingCodexSettings}>
            {savingCodexSettings ? 'Saving...' : 'Save'}
          </button>
        </div>

        <details className="connector-advanced">
          <summary><ChevronRight size={14} className="connector-advanced-chevron" /> Advanced · CLI command</summary>
          <div className="connector-advanced-body">
            <p className="admin-empty-note">
              Override the raw <code>codex</code> binary this feature shells out to. Leave blank to use the
              server&rsquo;s default (or the <code>CODEX_CLI_PATH</code> environment variable, if set).
            </p>
            <label>
              <span>Codex CLI command</span>
              <input
                value={codexSettingsForm.codex_cli_command}
                onChange={(event) => setCodexSettingsForm((current) => ({ ...current, codex_cli_command: event.target.value }))}
                placeholder="/usr/bin/codex"
              />
            </label>
          </div>
        </details>
      </div>

      <Modal open={showCodexConnectModal} onClose={handleCloseCodexConnectModal} title="Connect a ChatGPT Account">
        <div className="admin-form-card futuristic-card refined-admin-card">
          <div className="admin-card-head">
            <h2>Connect from this browser</h2>
            <span><Bot size={15} /> No SSH, and nothing to paste back</span>
          </div>
          <p className="admin-empty-note">
            Sign in with your ChatGPT plan using a one-time code. Approve it in your browser and this page notices on
            its own.
          </p>

          {codexConnect.status === 'starting' ? (
            <p className="char-counter"><Loader2 size={14} className="admin-spin" /> Starting sign-in on the server…</p>
          ) : null}

          {codexConnect.status === 'awaiting_approval' ? (
            <>
              <p className="admin-empty-note">Open this link and enter the code to approve:</p>
              {codexConnect.url ? (
                <p>
                  <a href={codexConnect.url} target="_blank" rel="noreferrer" className="text-link admin-open-link">
                    {codexConnect.url} <ExternalLink size={13} />
                  </a>
                </p>
              ) : null}
              {codexConnect.code ? (
                <p style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.08em' }}>{codexConnect.code}</p>
              ) : null}
              <p className="char-counter"><Loader2 size={14} className="admin-spin" /> Waiting for approval…</p>
            </>
          ) : null}

          {codexConnect.status === 'success' ? (
            <>
              <p className="form-status">Connected.</p>
              <div className="team-edit-actions admin-form-actions">
                <button type="button" className="primary-pill large auth-submit" onClick={handleCloseCodexConnectModal}>
                  Done
                </button>
              </div>
            </>
          ) : null}

          {codexConnect.status === 'failed' ? (
            <>
              <p className="form-error">{codexConnect.message || 'Connection failed.'}</p>
              <div className="team-edit-actions admin-form-actions">
                <button type="button" className="team-edit-btn" onClick={handleStartCodexConnect}>Try Again</button>
                <button type="button" className="team-edit-btn admin-danger-btn" onClick={handleCloseCodexConnectModal}>
                  Cancel
                </button>
              </div>
            </>
          ) : null}
        </div>
      </Modal>
    </AdminShell>
  )
}
