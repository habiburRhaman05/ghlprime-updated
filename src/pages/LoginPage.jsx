import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, UserCircle2 } from 'lucide-react'
import { signInWithPassword } from '../lib/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await signInWithPassword(form)

    if (signInError) {
      setError(signInError.message || 'Login failed')
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/admin/case-studies')
  }

  return (
    <main className="auth-shell refined-auth-shell">
      <div className="auth-noise" />
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-grid-lines" />

      <div className="auth-panel-wrap refined-auth-wrap">
        <div className="auth-side-copy refined-auth-copy">
          <span className="auth-kicker refined-auth-kicker"><Sparkles size={16} /> GHL Prime Admin Portal</span>
          <h1>Clean access to your content and team management system.</h1>
          <p>
            Manage case studies, update team profiles, and control the content backend from one polished admin workspace.
          </p>

          <div className="auth-side-features refined-auth-features">
            <div><ShieldCheck size={16} /><span>Secure admin login</span></div>
            <div><LockKeyhole size={16} /><span>JWT-secured authentication</span></div>
            <div><UserCircle2 size={16} /><span>Case study + team control</span></div>
          </div>
        </div>

        <form className="auth-card futuristic-auth-card refined-login-card" onSubmit={handleSubmit}>
          <div className="login-card-top">
            <span className="eyebrow-label">Admin Login</span>
            <h2>Welcome back</h2>
            <p>Enter your admin credentials to access the portal.</p>
          </div>

          <label>
            <span>Email address</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter your password"
              required
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="primary-pill large auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : <>Enter Dashboard <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </main>
  )
}
