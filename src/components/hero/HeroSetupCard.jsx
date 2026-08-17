import './hero-setup.css'

export default function HeroSetupCard() {
  const checklist = [
    { label: 'Sub-account created', state: 'done' },
    { label: 'Domain connected', state: 'done' },
    { label: 'Pipelines configured', state: 'done' },
    { label: 'Calendars set up', state: 'done' },
    { label: 'Twilio connected', state: 'done' },
    { label: 'A2P compliance registered', state: 'progress' },
    { label: 'Snapshots deployed', state: 'pending' },
    { label: 'Team users added', state: 'pending' },
  ]

  const settings = [
    { key: 'Industry', value: 'Real Estate Agency', verified: false },
    { key: 'Time Zone', value: 'America/New_York', verified: false },
    { key: 'Phone Provider', value: 'Twilio', verified: true },
    { key: 'Email Domain', value: 'agency.com', verified: true },
    { key: 'Snapshot', value: 'Agency Starter v3', verified: false },
    { key: 'HIPAA Mode', value: 'Disabled', verified: false },
  ]

  const badgeText = {
    done: 'Done',
    progress: 'In Progress',
    pending: 'Pending',
  }

  return (
    <div className="hsetup">
      {/* Browser chrome bar */}
      <div className="hsetup-chrome">
        <div className="hsetup-dots">
          <span className="hsetup-dot hsetup-dot-red" />
          <span className="hsetup-dot hsetup-dot-yellow" />
          <span className="hsetup-dot hsetup-dot-green" />
        </div>
        <div className="hsetup-url">app.gohighlevel.com/sub-accounts</div>
        <div className="hsetup-mode">GHL Prime Setup Mode</div>
      </div>

      {/* Content */}
      <div className="hsetup-content">
        {/* Left column */}
        <div className="hsetup-left">
          <div className="hsetup-eyebrow">Sub-Account Configuration</div>
          <div className="hsetup-title">Octopi Agency</div>
          <div className="hsetup-subtitle">Setup in progress...</div>

          <ul className="hsetup-checklist">
            {checklist.map((item) => (
              <li className={`hsetup-check-item hsetup-${item.state}`} key={item.label}>
                <span className="hsetup-checkbox">
                  {item.state === 'done' && (
                    <span className="hsetup-cb hsetup-cb-done">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                  {item.state === 'progress' && <span className="hsetup-cb hsetup-cb-progress" />}
                  {item.state === 'pending' && <span className="hsetup-cb hsetup-cb-pending" />}
                </span>
                <span className="hsetup-check-label">{item.label}</span>
                <span className={`hsetup-badge hsetup-badge-${item.state}`}>{badgeText[item.state]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column */}
        <div className="hsetup-right">
          <div className="hsetup-right-header">Account Settings</div>
          <div className="hsetup-settings">
            {settings.map((row) => (
              <div className="hsetup-setting-row" key={row.key}>
                <span className="hsetup-setting-key">{row.key}</span>
                <span className="hsetup-setting-value">
                  {row.verified && (
                    <svg className="hsetup-verify" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="hsetup-footer">
        <div className="hsetup-footer-left">
          <div className="hsetup-progress-track">
            <div className="hsetup-progress-fill" />
          </div>
          <span className="hsetup-progress-label">5 of 8 complete</span>
        </div>
        <div className="hsetup-footer-right">
          <span className="hsetup-cert-text">GHL Prime Certified Setup</span>
          <svg className="hsetup-cert-badge" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2l2.39 1.74 2.95-.02 1.16 2.71 2.71 1.16-.02 2.95L23 12l-1.74 2.39.02 2.95-2.71 1.16-1.16 2.71-2.95-.02L12 22l-2.39-1.74-2.95.02-1.16-2.71L2.79 16.4l.02-2.95L1 12l1.81-2.45-.02-2.95 2.71-1.16 1.16-2.71 2.95.02L12 2z"
              fill="#2563EB"
            />
            <path d="M8.5 12l2.2 2.2 4.8-4.8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
