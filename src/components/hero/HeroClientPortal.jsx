import './hero-client-portal.css';

export default function HeroClientPortal() {
  return (
    <div className="hportal">
      <div className="hportal-chrome">
        <div className="hportal-dots">
          <span className="hportal-dot hportal-dot-red" />
          <span className="hportal-dot hportal-dot-yellow" />
          <span className="hportal-dot hportal-dot-green" />
        </div>
        <div className="hportal-url">
          <svg className="hportal-url-lock" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span>portal.youragency.com/dashboard</span>
        </div>
        <div className="hportal-secure">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span>Secure &middot; Client View</span>
        </div>
      </div>

      <div className="hportal-body">
        <aside className="hportal-sidebar">
          <div className="hportal-brand">
            <div className="hportal-logo">YA</div>
            <div className="hportal-brand-text">
              <div className="hportal-brand-name">Your Agency</div>
              <div className="hportal-brand-sub">Client Portal</div>
            </div>
          </div>

          <nav className="hportal-nav">
            <a className="hportal-nav-item hportal-nav-active" href="#">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Dashboard</span>
            </a>
            <a className="hportal-nav-item" href="#">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 11l18-5v12L3 13v-2z" />
                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
              </svg>
              <span>Campaigns</span>
            </a>
            <a className="hportal-nav-item" href="#">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>Spend Report</span>
            </a>
            <a className="hportal-nav-item" href="#">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Leads</span>
            </a>
            <a className="hportal-nav-item" href="#">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="13" y2="17" />
              </svg>
              <span>Reports</span>
            </a>
            <a className="hportal-nav-item" href="#">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </a>
          </nav>

          <div className="hportal-user">
            <div className="hportal-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="hportal-user-name">John Smith</span>
          </div>
        </aside>

        <main className="hportal-main">
          <div className="hportal-main-header">
            <h2 className="hportal-title">Campaign Performance</h2>
            <span className="hportal-range-pill">Last 30 Days</span>
          </div>

          <div className="hportal-metrics">
            <div className="hportal-metric">
              <div className="hportal-metric-label">Total Spend</div>
              <div className="hportal-metric-value">$4,280</div>
              <div className="hportal-metric-change hportal-change-up">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>12%</span>
              </div>
            </div>
            <div className="hportal-metric">
              <div className="hportal-metric-label">Leads Generated</div>
              <div className="hportal-metric-value">143</div>
              <div className="hportal-metric-change hportal-change-up">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                <span>23%</span>
              </div>
            </div>
            <div className="hportal-metric">
              <div className="hportal-metric-label">Cost Per Lead</div>
              <div className="hportal-metric-value">$29.93</div>
              <div className="hportal-metric-change hportal-change-up">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="5 12 12 19 19 12" />
                </svg>
                <span>8%</span>
              </div>
            </div>
          </div>

          <div className="hportal-chart">
            <svg className="hportal-chart-svg" viewBox="0 0 320 60" preserveAspectRatio="none" aria-hidden="true">
              <polyline className="hportal-chart-line-spend" points="0,48 80,40 160,30 240,18 320,8" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline className="hportal-chart-line-leads" points="0,52 80,46 160,38 240,28 320,20" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="hportal-chart-x">
              <span>May 4</span>
              <span>May 10</span>
              <span>May 16</span>
              <span>May 22</span>
              <span>May 28</span>
            </div>
          </div>

          <div className="hportal-table">
            <div className="hportal-table-head">
              <span className="hportal-col-campaign">Campaign</span>
              <span className="hportal-col-num">Spend</span>
              <span className="hportal-col-num">Leads</span>
              <span className="hportal-col-num">CPL</span>
            </div>
            <div className="hportal-table-row">
              <span className="hportal-col-campaign">Spring FB Campaign</span>
              <span className="hportal-col-num">$2,140</span>
              <span className="hportal-col-num">74</span>
              <span className="hportal-col-num">$28.92</span>
            </div>
            <div className="hportal-table-row hportal-table-row-alt">
              <span className="hportal-col-campaign">Google Search</span>
              <span className="hportal-col-num">$2,140</span>
              <span className="hportal-col-num">69</span>
              <span className="hportal-col-num">$31.01</span>
            </div>
          </div>
        </main>
      </div>

      <div className="hportal-footer">Powered by YourAgency &middot; Secure Portal</div>
    </div>
  );
}
