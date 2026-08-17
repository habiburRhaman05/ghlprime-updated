import './hero-workflow-live.css'

export default function HeroWorkflowLive() {
  const nodes = [
    {
      label: 'Form Submitted',
      color: '#8b5cf6',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      ),
    },
    {
      label: 'Send SMS',
      color: '#06b6d4',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
        </svg>
      ),
    },
    {
      label: 'Add Tag',
      color: '#10b981',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      label: 'Create Opp',
      color: '#3b82f6',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
    },
    {
      label: 'Wait 5m',
      color: '#8b5cf6',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
        </svg>
      ),
    },
    {
      label: 'Book Call',
      color: '#f59e0b',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ]

  const Arrow = () => (
    <span className="hwflow-connector" aria-hidden="true">
      <span className="hwflow-connector-line" />
      <svg className="hwflow-connector-arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  )

  const feed = [
    { dot: 'green', text: 'Sarah M. SMS sent, tag added, opportunity created', time: '2s ago' },
    { dot: 'green', text: 'James K. Booking link sent, call scheduled', time: '14s ago' },
    { dot: 'blue', text: 'Marcus T. Entered workflow, in progress...', time: '31s ago' },
  ]

  const stats = ['47 leads today', '100% delivered', '3 booking links sent', '0 errors']

  return (
    <div className="hwflow">
      <div className="hwflow-chrome">
        <div className="hwflow-dots">
          <span className="hwflow-dot hwflow-dot-red" />
          <span className="hwflow-dot hwflow-dot-yellow" />
          <span className="hwflow-dot hwflow-dot-green" />
        </div>
        <div className="hwflow-url">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="hwflow-url-text">app.gohighlevel.com/workflows/lead-followup</span>
        </div>
        <div className="hwflow-live-badge">
          <span className="hwflow-pulse-dot" />
          <span className="hwflow-live-text">Live Running</span>
        </div>
      </div>

      <div className="hwflow-content">
        <div className="hwflow-heading">
          <div className="hwflow-title">Lead Follow-Up Automation</div>
          <div className="hwflow-sub">Trigger: Form submitted · Running 24/7</div>
        </div>

        <div className="hwflow-node-row">
          {nodes.map((node, i) => (
            <div className="hwflow-node-item" key={node.label}>
              <div className="hwflow-node" style={{ borderLeftColor: node.color }}>
                <span className="hwflow-node-icon">{node.icon}</span>
                <span className="hwflow-node-label">{node.label}</span>
              </div>
              {i < nodes.length - 1 && <Arrow />}
            </div>
          ))}
        </div>

        <div className="hwflow-feed">
          <div className="hwflow-feed-header">
            <span className="hwflow-pulse-dot hwflow-pulse-dot-feed" />
            <span className="hwflow-feed-title">Live Activity</span>
            <span className="hwflow-feed-updated">Updated just now</span>
          </div>
          {feed.map((row) => (
            <div className="hwflow-feed-row" key={row.text}>
              <span className={`hwflow-feed-dot hwflow-feed-dot-${row.dot}`} />
              <span className="hwflow-feed-text">{row.text}</span>
              <span className="hwflow-feed-time">{row.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hwflow-stats">
        {stats.map((stat, i) => (
          <div className="hwflow-stat" key={stat}>
            <span className="hwflow-stat-text">{stat}</span>
            {i < stats.length - 1 && <span className="hwflow-stat-divider" />}
          </div>
        ))}
      </div>
    </div>
  )
}
