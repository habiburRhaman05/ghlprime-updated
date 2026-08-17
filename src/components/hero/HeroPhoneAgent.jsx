import './hero-phone-agent.css'

export default function HeroPhoneAgent() {
  return (
    <div className="hphone">
      <div className="hphone-body">
        <div className="hphone-screen">
          {/* Notch */}
          <div className="hphone-notch" />

          {/* Status bar */}
          <div className="hphone-statusbar">
            <span className="hphone-time">9:41</span>
            <span className="hphone-status-icons">
              {/* Signal */}
              <svg className="hphone-svc-icon" width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#475569" />
                <rect x="4" y="5" width="3" height="7" rx="0.5" fill="#475569" />
                <rect x="8" y="2" width="3" height="10" rx="0.5" fill="#475569" />
                <rect x="12" y="0" width="3" height="12" rx="0.5" fill="#94A3B8" />
              </svg>
              {/* Wifi */}
              <svg className="hphone-svc-icon" width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                <path d="M8 11.2 9.8 9.4a2.5 2.5 0 0 0-3.6 0L8 11.2Z" fill="#475569" />
                <path d="M3.6 6.6a6.2 6.2 0 0 1 8.8 0" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M1.4 4.4a9.3 9.3 0 0 1 13.2 0" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {/* Battery */}
              <svg className="hphone-svc-icon" width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
                <rect x="0.5" y="1" width="18" height="10" rx="2.5" stroke="#475569" strokeWidth="1" />
                <rect x="2" y="2.5" width="13" height="7" rx="1.2" fill="#475569" />
                <rect x="20" y="4" width="1.5" height="4" rx="0.75" fill="#475569" />
              </svg>
            </span>
          </div>

          {/* WhatsApp header */}
          <div className="hphone-header">
            <button className="hphone-back" type="button" aria-label="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18 9 12l6-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="hphone-avatar">AI</div>
            <div className="hphone-header-meta">
              <div className="hphone-header-name">AI Lead Agent</div>
              <div className="hphone-header-online">online</div>
            </div>
            <div className="hphone-header-actions">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 10.5V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3.5l5 3.5V7l-5 3.5Z" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Chat area */}
          <div className="hphone-chat">
            <div className="hphone-msg hphone-msg-in">
              <div className="hphone-bubble">
                <span className="hphone-text">Hey, I saw your ad. Interested in your service</span>
                <span className="hphone-meta">
                  <span className="hphone-msg-time">10:42 AM</span>
                </span>
              </div>
            </div>

            <div className="hphone-msg hphone-msg-out">
              <div className="hphone-bubble">
                <span className="hphone-text">Hi! Thanks for reaching out. What&apos;s your monthly budget?</span>
                <span className="hphone-meta">
                  <span className="hphone-msg-time">10:42 AM</span>
                  <svg className="hphone-ticks" width="16" height="11" viewBox="0 0 18 11" fill="none" aria-hidden="true">
                    <path d="M1 6.2 3.6 9 9 2.4" stroke="#34B7F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6.2 10.6 9 16 2.4" stroke="#34B7F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="hphone-msg hphone-msg-in">
              <div className="hphone-bubble">
                <span className="hphone-text">Around $2,000/month</span>
                <span className="hphone-meta">
                  <span className="hphone-msg-time">10:43 AM</span>
                </span>
              </div>
            </div>

            <div className="hphone-msg hphone-msg-out">
              <div className="hphone-bubble">
                <span className="hphone-text">Perfect. Are you currently using GoHighLevel?</span>
                <span className="hphone-meta">
                  <span className="hphone-msg-time">10:43 AM</span>
                  <svg className="hphone-ticks" width="16" height="11" viewBox="0 0 18 11" fill="none" aria-hidden="true">
                    <path d="M1 6.2 3.6 9 9 2.4" stroke="#34B7F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6.2 10.6 9 16 2.4" stroke="#34B7F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="hphone-msg hphone-msg-in">
              <div className="hphone-bubble">
                <span className="hphone-text">Yes, about 6 months</span>
                <span className="hphone-meta">
                  <span className="hphone-msg-time">10:44 AM</span>
                </span>
              </div>
            </div>

            <div className="hphone-msg hphone-msg-out">
              <div className="hphone-bubble">
                <span className="hphone-text">Great you&apos;re a great fit! I&apos;m booking a discovery call for you now.</span>
                <span className="hphone-meta">
                  <span className="hphone-msg-time">10:44 AM</span>
                  <svg className="hphone-ticks" width="16" height="11" viewBox="0 0 18 11" fill="none" aria-hidden="true">
                    <path d="M1 6.2 3.6 9 9 2.4" stroke="#34B7F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6.2 10.6 9 16 2.4" stroke="#34B7F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <span className="hphone-pill">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12.5 10 17.5 19 6.5" stroke="#166534" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lead Qualified &middot; CRM Updated
              </span>
            </div>
          </div>

          {/* Bottom input bar */}
          <div className="hphone-inputbar">
            <svg className="hphone-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9.2" stroke="#94A3B8" strokeWidth="1.7" />
              <circle cx="8.8" cy="10" r="1.1" fill="#94A3B8" />
              <circle cx="15.2" cy="10" r="1.1" fill="#94A3B8" />
              <path d="M8.2 14.5a5 5 0 0 0 7.6 0" stroke="#94A3B8" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <span className="hphone-placeholder">Type a message...</span>
            <svg className="hphone-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="9" y="2.5" width="6" height="11" rx="3" stroke="#94A3B8" strokeWidth="1.7" />
              <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="#94A3B8" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
