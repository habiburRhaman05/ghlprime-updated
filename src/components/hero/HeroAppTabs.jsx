import './hero-app-tabs.css'
import { useState } from 'react'

/* ---------- Shared status-bar icons (signal / wifi / battery) ---------- */
function StatusIcons() {
  return (
    <span className="happtabs-status-icons">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
        <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#475569" />
        <rect x="4" y="5" width="3" height="7" rx="0.5" fill="#475569" />
        <rect x="8" y="2" width="3" height="10" rx="0.5" fill="#475569" />
        <rect x="12" y="0" width="3" height="12" rx="0.5" fill="#94A3B8" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
        <path d="M8 11.2 9.8 9.4a2.5 2.5 0 0 0-3.6 0L8 11.2Z" fill="#475569" />
        <path d="M3.6 6.6a6.2 6.2 0 0 1 8.8 0" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M1.4 4.4a9.3 9.3 0 0 1 13.2 0" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
        <rect x="0.5" y="1" width="18" height="10" rx="2.5" stroke="#475569" strokeWidth="1" />
        <rect x="2" y="2.5" width="13" height="7" rx="1.2" fill="#475569" />
        <rect x="20" y="4" width="1.5" height="4" rx="0.75" fill="#475569" />
      </svg>
    </span>
  )
}

/* ---------- Small up-arrow used in change indicators ---------- */
function UpArrow({ size = 12, color = '#22C55E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

function DownArrow({ size = 11, color = '#22C55E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="5 12 12 19 19 12" />
    </svg>
  )
}

/* ================================================================== */
/* TAB 1 — Mobile Apps                                                 */
/* ================================================================== */
function MobilePanel() {
  return (
    <div className="happtabs-phone-wrap">
      <div className="happtabs-phone">
        <div className="happtabs-phone-screen">
          {/* Status bar */}
          <div className="happtabs-statusbar">
            <span className="happtabs-time">9:41</span>
            <StatusIcons />
          </div>

          {/* App header */}
          <div className="happtabs-appheader">
            <button className="happtabs-appheader-btn" type="button" aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18 9 12l6-6" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="happtabs-appheader-title">FinanceFlow</span>
            <button className="happtabs-appheader-btn" type="button" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="happtabs-phone-content">
            {/* Balance card */}
            <div className="happtabs-balance">
              <div className="happtabs-balance-label">Total Balance</div>
              <div className="happtabs-balance-value">$124,580</div>
              <div className="happtabs-balance-change">
                <UpArrow size={12} color="#22C55E" />
                <span>+12.4% this month</span>
              </div>
            </div>

            {/* Action row */}
            <div className="happtabs-actions">
              <div className="happtabs-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                <span className="happtabs-action-label">Send</span>
              </div>
              <div className="happtabs-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
                <span className="happtabs-action-label">Receive</span>
              </div>
              <div className="happtabs-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span className="happtabs-action-label">Invest</span>
              </div>
              <div className="happtabs-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="5" cy="12" r="1.6" />
                  <circle cx="12" cy="12" r="1.6" />
                  <circle cx="19" cy="12" r="1.6" />
                </svg>
                <span className="happtabs-action-label">More</span>
              </div>
            </div>

            {/* Portfolio card */}
            <div className="happtabs-portfolio">
              <div className="happtabs-portfolio-title">Portfolio Overview</div>
              <div className="happtabs-portfolio-sub">Updated just now</div>
              <svg className="happtabs-sparkline" viewBox="0 0 240 32" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="0,26 40,22 80,24 120,16 160,18 200,9 240,4" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* AI card */}
            <div className="happtabs-ai">
              <div className="happtabs-ai-circle">AI</div>
              <div className="happtabs-ai-meta">
                <div className="happtabs-ai-title">AI Insights</div>
                <div className="happtabs-ai-sub">3 new recommendations</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="happtabs-bottomnav">
            <div className="happtabs-navitem happtabs-navitem-active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" />
              </svg>
              <span className="happtabs-navitem-label">Home</span>
            </div>
            <div className="happtabs-navitem">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              <span className="happtabs-navitem-label">Portfolio</span>
            </div>
            <div className="happtabs-navitem">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 17 9 11 13 15 21 7" />
                <polyline points="15 7 21 7 21 13" />
              </svg>
              <span className="happtabs-navitem-label">Markets</span>
            </div>
            <div className="happtabs-navitem">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="happtabs-navitem-label">Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store buttons */}
      <div className="happtabs-store">
        <a className="happtabs-store-btn" href="#" aria-label="Download on the App Store">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white" />
          </svg>
          <span className="happtabs-store-text">
            <span className="happtabs-store-top">Download on the</span>
            <span className="happtabs-store-bottom">App Store</span>
          </span>
        </a>
        <a className="happtabs-store-btn" href="#" aria-label="Get it on Google Play">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path fill="#FF4444" d="M1.22 0L13.41 12 1.22 24C.85 23.79.6 23.4.6 22.94V1.06C.6.6.85.21 1.22 0z" />
            <path fill="#FFBB00" d="M17.35 7.93L4.52.34l9.55 9.55 3.28-1.96z" />
            <path fill="#00EE76" d="M17.35 16.07l-3.28-1.96L4.52 23.66l12.83-7.59z" />
            <path fill="#00D3FF" d="M22.78 11.07c.37.21.62.6.62 1.06 0 .46-.25.85-.62 1.06l-2.75 1.64-3.68-3.77 3.68-3.63 2.75 1.64z" />
          </svg>
          <span className="happtabs-store-text">
            <span className="happtabs-store-top">Get it on</span>
            <span className="happtabs-store-bottom">Google Play</span>
          </span>
        </a>
      </div>

      {/* Small stats row */}
      <div className="happtabs-stats">
        <span className="happtabs-stat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>4.9 Rating</span>
        </span>
        <span className="happtabs-stat">50K+ Downloads</span>
        <span className="happtabs-stat">68% Retention</span>
      </div>
    </div>
  )
}

/* ================================================================== */
/* TAB 2 — Web Apps                                                    */
/* ================================================================== */
function WebPanel() {
  return (
    <div className="happtabs-browser">
      {/* Chrome bar */}
      <div className="happtabs-chrome">
        <div className="happtabs-dots">
          <span className="happtabs-dot happtabs-dot-red" />
          <span className="happtabs-dot happtabs-dot-yellow" />
          <span className="happtabs-dot happtabs-dot-green" />
        </div>
        <span className="happtabs-url">app.yourproduct.com/dashboard</span>
        <span className="happtabs-live">
          <span className="happtabs-live-dot" />
          <span>Live Preview</span>
        </span>
      </div>

      {/* Dashboard */}
      <div className="happtabs-dash">
        {/* Sidebar */}
        <aside className="happtabs-bsidebar">
          <div className="happtabs-bbrand">
            <div className="happtabs-blogo">Y</div>
            <span className="happtabs-bbrand-name">YourApp</span>
          </div>
          <nav className="happtabs-bnav">
            <div className="happtabs-bnav-item happtabs-bnav-active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Dashboard</span>
            </div>
            <div className="happtabs-bnav-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Users</span>
            </div>
            <div className="happtabs-bnav-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>Revenue</span>
            </div>
            <div className="happtabs-bnav-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Analytics</span>
            </div>
            <div className="happtabs-bnav-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="happtabs-bmain">
          <div className="happtabs-bmain-header">
            <h3 className="happtabs-bmain-title">Dashboard</h3>
            <span className="happtabs-bmain-drop">
              <span>Last 30 days</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>

          {/* Metric cards */}
          <div className="happtabs-bmetrics">
            <div className="happtabs-bmetric">
              <div className="happtabs-bmetric-label">Monthly Revenue</div>
              <div className="happtabs-bmetric-value">$24,800</div>
              <div className="happtabs-bmetric-change">
                <UpArrow size={11} color="#22C55E" />
                <span>18%</span>
              </div>
            </div>
            <div className="happtabs-bmetric">
              <div className="happtabs-bmetric-label">Active Users</div>
              <div className="happtabs-bmetric-value">1,247</div>
              <div className="happtabs-bmetric-change">
                <UpArrow size={11} color="#22C55E" />
                <span>23%</span>
              </div>
            </div>
            <div className="happtabs-bmetric">
              <div className="happtabs-bmetric-label">Churn Rate</div>
              <div className="happtabs-bmetric-value">2.1%</div>
              <div className="happtabs-bmetric-change">
                <DownArrow size={11} color="#22C55E" />
                <span>0.4%</span>
              </div>
            </div>
          </div>

          {/* Area chart */}
          <div className="happtabs-bchart">
            <svg className="happtabs-bchart-svg" viewBox="0 0 320 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,50 L64,42 L128,46 L192,28 L256,30 L320,12 L320,60 L0,60 Z" fill="#DBEAFE" />
              <polyline points="0,50 64,42 128,46 192,28 256,30 320,12" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="happtabs-bchart-x">
              <span>May 1</span>
              <span>May 8</span>
              <span>May 15</span>
              <span>May 22</span>
              <span>May 29</span>
            </div>
          </div>

          {/* User table */}
          <div className="happtabs-btable">
            <div className="happtabs-btable-head">
              <span>User</span>
              <span>Plan</span>
              <span>MRR</span>
              <span>Status</span>
            </div>
            <div className="happtabs-btable-row">
              <span>Sarah M.</span>
              <span>Pro</span>
              <span>$99/mo</span>
              <span className="happtabs-btable-status">
                <span className="happtabs-status-dot" />
                <span>Active</span>
              </span>
            </div>
            <div className="happtabs-btable-row happtabs-btable-row-alt">
              <span>James K.</span>
              <span>Team</span>
              <span>$299/mo</span>
              <span className="happtabs-btable-status">
                <span className="happtabs-status-dot" />
                <span>Active</span>
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ================================================================== */
/* TAB 3 — Tablet Apps                                                 */
/* ================================================================== */
function TabletPanel() {
  return (
    <div className="happtabs-tablet-wrap">
      <div className="happtabs-tablet">
        <div className="happtabs-tablet-screen">
          {/* Left panel */}
          <div className="happtabs-tleft">
            <div className="happtabs-tleft-header">
              <span className="happtabs-tleft-title">Projects</span>
              <button className="happtabs-tnew" type="button">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>New</span>
              </button>
            </div>

            <div className="happtabs-titem happtabs-titem-active">
              <span className="happtabs-titem-name">GHL Agency Dashboard</span>
              <span className="happtabs-titem-meta">In Progress &middot; 68%</span>
            </div>
            <div className="happtabs-titem">
              <span className="happtabs-titem-name">Client Portal Build</span>
              <span className="happtabs-titem-meta">Review &middot; 100%</span>
            </div>
            <div className="happtabs-titem">
              <span className="happtabs-titem-name">Mobile App MVP</span>
              <span className="happtabs-titem-meta">In Progress &middot; 45%</span>
            </div>
            <div className="happtabs-titem">
              <span className="happtabs-titem-name">Automation Setup</span>
              <span className="happtabs-titem-meta">Planning &middot; 10%</span>
            </div>
          </div>

          {/* Right panel */}
          <div className="happtabs-tright">
            <h3 className="happtabs-tright-title">GHL Agency Dashboard</h3>
            <div className="happtabs-tbadges">
              <span className="happtabs-tbadge happtabs-tbadge-blue">In Progress</span>
              <span className="happtabs-tbadge">Due Jun 15</span>
              <span className="happtabs-tbadge">3 team members</span>
            </div>

            <div className="happtabs-tprogress-track">
              <div className="happtabs-tprogress-fill" />
            </div>
            <div className="happtabs-tprogress-label">68% Complete</div>

            <div className="happtabs-ttasks">
              {/* Completed */}
              <div className="happtabs-ttask">
                <span className="happtabs-ttask-check" style={{ background: '#2563EB' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="happtabs-ttask-label">Database schema</span>
                <span className="happtabs-tavatar">SM</span>
              </div>
              {/* Completed */}
              <div className="happtabs-ttask">
                <span className="happtabs-ttask-check" style={{ background: '#2563EB' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="happtabs-ttask-label">Auth &amp; RLS setup</span>
                <span className="happtabs-tavatar">JK</span>
              </div>
              {/* In Progress — amber half/spinner */}
              <div className="happtabs-ttask">
                <svg className="happtabs-ttask-check" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="#FCD34D" strokeWidth="3" fill="none" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
                <span className="happtabs-ttask-label">Dashboard UI</span>
                <span className="happtabs-tavatar">SM</span>
              </div>
              {/* Pending — empty gray circle */}
              <div className="happtabs-ttask">
                <svg className="happtabs-ttask-check" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                </svg>
                <span className="happtabs-ttask-label">API integrations</span>
                <span className="happtabs-tavatar">JK</span>
              </div>
            </div>

            <div className="happtabs-tmilestone">Next milestone: Client review &mdash; June 15</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/* Root                                                               */
/* ================================================================== */
export default function HeroAppTabs() {
  const [active, setActive] = useState('mobile')

  const tabs = [
    { id: 'web', full: 'Web Apps', short: 'Web' },
    { id: 'mobile', full: 'Mobile Apps', short: 'Mobile' },
    { id: 'tablet', full: 'Tablet Apps', short: 'Tablet' },
  ]

  return (
    <div className="happtabs">
      <div className="happtabs-tabs" role="tablist" aria-label="App platform">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={`happtabs-tab${active === tab.id ? ' happtabs-tab-active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            <span className="happtabs-tab-full">{tab.full}</span>
            <span className="happtabs-tab-short">{tab.short}</span>
          </button>
        ))}
      </div>

      <div className="happtabs-panel" key={active}>
        {active === 'web' && <WebPanel />}
        {active === 'mobile' && <MobilePanel />}
        {active === 'tablet' && <TabletPanel />}
      </div>
    </div>
  )
}
