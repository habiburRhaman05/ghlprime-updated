import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, CheckCircle2, ExternalLink, Loader2, Play, XCircle } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import { getSession, signOut } from '../lib/auth'
import { fetchBlogAiRuns, fetchBlogAiSettings, runBlogAiNow, saveBlogAiSettings } from '../lib/blogAiApi'
import '../styles/admin-extras.css'

// Blog-writing settings + Run Now + Recent Runs only. The Claude/Codex
// account-connection UI (accounts list, "connect in browser" flows, Codex
// panel) lives on its own page now — see AdminAiConnectionsPage.jsx — since
// the customer asked for the two concerns to be split apart.

const initialSettingsForm = {
  instructions: '',
  keywords: '',
  advanced_instructions: '',
  auto_publish: false,
  schedule_hour: 6,
  posts_per_day: 1,
}

function mapSettingsToForm(settings) {
  return {
    instructions: settings.instructions || '',
    keywords: settings.keywords || '',
    advanced_instructions: settings.advanced_instructions || '',
    auto_publish: Boolean(settings.auto_publish),
    schedule_hour: settings.schedule_hour ?? 6,
    posts_per_day: settings.posts_per_day ?? 1,
  }
}

function formatDateTime(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function RunStatusBadge({ status }) {
  if (status === 'success') {
    return <span className="admin-blog-status-badge published"><CheckCircle2 size={13} /> Success</span>
  }
  if (status === 'running') {
    return <span className="admin-blog-status-badge draft"><Loader2 size={13} className="admin-spin" /> Running</span>
  }
  return (
    <span
      className="admin-blog-status-badge draft"
      style={{ color: '#ff9b9b', background: 'rgba(248,113,113,.1)', borderColor: 'rgba(248,113,113,.32)' }}
    >
      <XCircle size={13} /> Failed
    </span>
  )
}

export default function AdminBlogAiPage() {
  const [session, setSession] = useState(undefined)
  const [settingsForm, setSettingsForm] = useState(initialSettingsForm)
  const [runs, setRuns] = useState([])
  const [status, setStatus] = useState(null) // { type: 'status' | 'error', message }
  const [savingSettings, setSavingSettings] = useState(false)
  const [runningNow, setRunningNow] = useState(false)

  async function loadAll() {
    const [settingsRes, runsRes] = await Promise.all([
      fetchBlogAiSettings(),
      fetchBlogAiRuns(50),
    ])

    if (settingsRes.data) setSettingsForm(mapSettingsToForm(settingsRes.data))
    if (Array.isArray(runsRes.data)) setRuns(runsRes.data)
  }

  useEffect(() => {
    getSession().then(setSession)
    fetchBlogAiSettings().then(({ data }) => { if (data) setSettingsForm(mapSettingsToForm(data)) })
    fetchBlogAiRuns(50).then(({ data }) => { if (Array.isArray(data)) setRuns(data) })
  }, [])

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  async function handleSaveSettings(event) {
    event.preventDefault()
    setSavingSettings(true)
    setStatus(null)

    const { data, error } = await saveBlogAiSettings(settingsForm)

    if (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to save settings' })
      setSavingSettings(false)
      return
    }

    setSettingsForm(mapSettingsToForm(data))
    setStatus({ type: 'status', message: 'Settings saved.' })
    setSavingSettings(false)
  }

  async function handleRunNow() {
    setRunningNow(true)
    setStatus(null)

    const { data, error } = await runBlogAiNow()

    if (error) {
      setStatus({ type: 'error', message: error.message || 'Run failed to start' })
      setRunningNow(false)
      return
    }

    if (data.success) {
      setStatus({ type: 'status', message: `Generated "${data.post?.title}" — saved as ${data.post?.published ? 'published' : 'a draft'}.` })
    } else {
      setStatus({ type: 'error', message: data.error || 'Run failed' })
    }

    await loadAll()
    setRunningNow(false)
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading Auto Blog...">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><Bot size={16} /> Auto Blog</span>
          <h1>Let AI write SEO-optimized blog posts using your own Claude Code / Codex logins.</h1>
          <p>Generated posts save as drafts for review by default. Enable auto-publish below if you want them to go live automatically.</p>
        </div>
        <div className="admin-top-actions">
          <Link to="/admin/blog" className="secondary-pill">Blog Library</Link>
          <Link to="/admin/ai-connections" className="secondary-pill">AI Connections</Link>
          <button type="button" className="primary-pill" onClick={handleRunNow} disabled={runningNow}>
            {runningNow ? <><Loader2 size={16} className="admin-spin" /> Running...</> : <><Play size={16} /> Run Now</>}
          </button>
        </div>
      </div>

      {status ? <div className={status.type === 'error' ? 'form-error' : 'form-status'}>{status.message}</div> : null}

      <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleSaveSettings}>
        <div className="admin-card-head">
          <h2>Generation Settings</h2>
          <span>Shared by every run — manual or scheduled</span>
        </div>

        <div className="admin-form-grid">
          <label className="full-width">
            <span>Instructions</span>
            <textarea
              rows="4"
              placeholder="e.g. Write in a confident, practical tone for GoHighLevel agency owners. Favor concrete examples over theory."
              value={settingsForm.instructions}
              onChange={(event) => setSettingsForm((current) => ({ ...current, instructions: event.target.value }))}
            />
          </label>
          <label className="full-width">
            <span>Keywords</span>
            <textarea
              rows="2"
              placeholder="gohighlevel automation, ai agents for agencies, crm workflows"
              value={settingsForm.keywords}
              onChange={(event) => setSettingsForm((current) => ({ ...current, keywords: event.target.value }))}
            />
          </label>
          <label className="full-width">
            <span>Advanced instructions</span>
            <textarea
              rows="4"
              placeholder="Anything else to steer the model — internal linking rules, formatting preferences, topics to avoid, etc."
              value={settingsForm.advanced_instructions}
              onChange={(event) => setSettingsForm((current) => ({ ...current, advanced_instructions: event.target.value }))}
            />
          </label>

          <label>
            <span>Schedule hour (UTC)</span>
            <input
              type="number"
              min="0"
              max="23"
              value={settingsForm.schedule_hour}
              onChange={(event) => setSettingsForm((current) => ({ ...current, schedule_hour: event.target.value }))}
            />
          </label>

          <label>
            <span>Posts per day</span>
            <input
              type="number"
              min="1"
              max="10"
              value={settingsForm.posts_per_day}
              onChange={(event) => setSettingsForm((current) => ({ ...current, posts_per_day: event.target.value }))}
            />
          </label>

          <div className="full-width admin-team-assignment-box refined-assignment-box">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={settingsForm.auto_publish}
                onChange={(event) => setSettingsForm((current) => ({ ...current, auto_publish: event.target.checked }))}
              />
              <span>Auto-publish generated posts</span>
            </label>
            <p className="admin-empty-note">
              {settingsForm.auto_publish
                ? 'On: new posts publish automatically as soon as they generate.'
                : 'Off (default): new posts save as drafts for review in the Blog Library — nothing goes live automatically.'}
            </p>
          </div>
        </div>

        <div className="team-edit-actions admin-form-actions">
          <button className="primary-pill large auth-submit" type="submit" disabled={savingSettings}>
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      <div className="admin-list-card futuristic-card refined-admin-card">
        <div className="admin-card-head admin-section-head">
          <h2>Recent Runs</h2>
          <span className="admin-list-meta">{runs.length} shown</span>
        </div>
        <div className="admin-blog-table-wrap">
          <table className="admin-blog-table">
            <thead>
              <tr>
                <th>Started</th>
                <th>Status</th>
                <th>Provider</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id}>
                  <td>{formatDateTime(run.started_at)}</td>
                  <td><RunStatusBadge status={run.status} /></td>
                  <td>{run.provider || '—'}{run.account_label ? ` · ${run.account_label}` : ''}</td>
                  <td>
                    {run.blog_post_id && run.blog_post_published ? (
                      <Link to={`/blog/${run.blog_post_slug}`} className="text-link admin-open-link">
                        {run.blog_post_title || 'View post'} <ExternalLink size={13} />
                      </Link>
                    ) : run.blog_post_id ? (
                      <Link to="/admin/blog" className="text-link admin-open-link">
                        {run.blog_post_title || 'Draft saved'} (draft — review in Blog Library)
                      </Link>
                    ) : (
                      <span style={{ color: run.error ? '#ffb0b0' : undefined }}>{run.error || '—'}</span>
                    )}
                  </td>
                </tr>
              ))}
              {!runs.length ? (
                <tr><td colSpan={4} className="admin-blog-empty">No runs yet. Click “Run Now” above to generate the first post.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
