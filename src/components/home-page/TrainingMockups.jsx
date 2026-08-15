import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Contact,
  CreditCard,
  Globe,
  LayoutDashboard,
  MapPin,
  Megaphone,
  MessageSquare,
  Rocket,
  Send,
  Settings,
  Target,
  User,
  Workflow,
  Zap,
} from 'lucide-react'
import './training-mockups.css'

/*
 * Mock GHL Prime dashboards for the Expert Training & Onboarding section.
 *
 * Built as markup rather than bitmaps so they stay sharp at any width and on
 * retina, and so the stats and flow nodes can animate. Same approach the
 * Vibe Coding section already takes with its IDE.
 *
 * SWAPPING IN A REAL DESIGN: each mock is rendered through <MockFrame>, and
 * TrainingOnboarding passes an optional `image` per step. Set that to a file
 * in /public and the frame renders the image instead of the markup, with no
 * other change needed. See STEPS in TrainingOnboarding.jsx.
 *
 * Everything here is invented product UI, so each frame is aria-hidden and
 * built from spans and divs. It must never read as a factual claim, and it
 * must not leak into the page's text content.
 */

const NAV = [
  { label: 'Launchpad', Icon: Rocket },
  { label: 'Dashboard', Icon: LayoutDashboard },
  { label: 'Conversations', Icon: MessageSquare },
  { label: 'Calendars', Icon: Calendar },
  { label: 'Contacts', Icon: Contact },
  { label: 'Opportunities', Icon: Target },
  { label: 'Payments', Icon: CreditCard },
  { label: 'Workflows', Icon: Workflow },
  { label: 'Marketing', Icon: Megaphone },
  { label: 'Automation', Icon: Zap },
  { label: 'Sites', Icon: Globe },
  { label: 'Settings', Icon: Settings },
]

function Sidebar({ active }) {
  return (
    <div className="tm-side">
      <div className="tm-brand">
        <img src="/gohighlevel.png" alt="" className="tm-brand-mark" width="16" height="16" decoding="async" />
        <span className="tm-brand-name">GHL Prime</span>
      </div>
      <div className="tm-nav">
        {NAV.map((item) => (
          <div key={item.label} className={`tm-nav-item${item.label === active ? ' is-active' : ''}`}>
            <item.Icon size={11} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* The swap point. Pass `image` to replace the whole mock with a real export. */
export function MockFrame({ image, alt, active, children }) {
  if (image) {
    return (
      <div className="tm-frame tm-frame-image">
        <img src={image} alt={alt || ''} className="tm-real" loading="lazy" decoding="async" />
      </div>
    )
  }

  return (
    <div className="tm-frame" aria-hidden="true">
      <Sidebar active={active} />
      <div className="tm-body">{children}</div>
    </div>
  )
}

/* --- 01. Workflow builder ------------------------------------------------ */

const FLOW = [
  { title: 'New Lead Trigger', sub: 'Form Submitted', tone: 'green' },
  { title: 'Lead Qualification', sub: 'AI Agent', tone: 'green' },
  { title: 'CRM Update', sub: 'Update Contact', tone: 'green' },
  { title: 'Appointment', sub: 'Create Appointment', tone: 'blue' },
]

const FLOW_TABS = ['Builder', 'Settings', 'Enrollment History', 'Execution Logs', 'Test']

export function WorkflowMock() {
  return (
    <>
      <div className="tm-head">
        <span className="tm-head-title">New Lead Workflow</span>
      </div>
      <div className="tm-tabs">
        {FLOW_TABS.map((tab, i) => (
          <span key={tab} className={`tm-tab${i === 0 ? ' is-active' : ''}`}>{tab}</span>
        ))}
      </div>

      <div className="tm-flow-wrap">
        <div className="tm-flow">
          {FLOW.map((node, i) => (
            <div className="tm-flow-item" key={node.title}>
              <div className="tm-node" style={{ '--d': `${i * 0.45}s` }}>
                <span className={`tm-node-dot tone-${node.tone}`}>
                  {node.tone === 'blue' ? <User size={9} /> : <MapPin size={9} />}
                </span>
                <span className="tm-node-copy">
                  <span className="tm-node-title">{node.title}</span>
                  <span className="tm-node-sub">{node.sub}</span>
                </span>
              </div>
              {i < FLOW.length - 1 ? <span className="tm-flow-join" aria-hidden="true">+</span> : null}
            </div>
          ))}
        </div>

        <div className="tm-stats-card">
          <span className="tm-stats-label">Workflow Stats</span>
          <span className="tm-stats-value">128</span>
          <span className="tm-stats-sub">Active Enrollments</span>
          <svg className="tm-spark" viewBox="0 0 120 40" fill="none" preserveAspectRatio="none">
            <path
              className="tm-spark-line"
              d="M2 34 L18 30 L32 32 L46 22 L60 26 L74 14 L88 18 L104 6 L118 9"
              stroke="#22c3a6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="tm-stats-foot">Last run: 2 min ago</span>
          <span className="tm-badge-ok"><CheckCircle2 size={9} /> Successful</span>
        </div>
      </div>
    </>
  )
}

/* --- 02. AI agent configuration ------------------------------------------ */

const AGENT_NAV = ['Agent Details', 'Goals', 'Instructions', 'Knowledge', 'Actions', 'Advanced', 'Test Agent']

export function AgentMock() {
  return (
    <>
      <div className="tm-head">
        <span className="tm-head-title">AI Agent Configuration</span>
      </div>

      <div className="tm-agent">
        <div className="tm-agent-nav">
          {AGENT_NAV.map((item, i) => (
            <span key={item} className={`tm-agent-nav-item${i === 0 ? ' is-active' : ''}`}>{item}</span>
          ))}
        </div>

        <div className="tm-agent-main">
          <span className="tm-label">Instructions</span>
          <div className="tm-textarea">
            You are a helpful AI assistant for our business. Your job is to qualify leads,
            answer questions, and book appointments when qualified.
          </div>

          <span className="tm-label">Conversation Flow</span>
          <div className="tm-cflow">
            <span className="tm-cnode">Greet Lead</span>
            <span className="tm-cbar" />
            <span className="tm-cnode">Ask Qualification Questions</span>
            <span className="tm-cbar" />
            <span className="tm-cnode">Check Lead Score &gt; 70</span>
            <div className="tm-cbranch">
              <span className="tm-cyes">Yes</span>
              <span className="tm-cno">No</span>
            </div>
            <div className="tm-couts">
              <span className="tm-cout tone-green">Book Appointment</span>
              <span className="tm-cout tone-red">Nurture &amp; Follow Up</span>
            </div>
          </div>
        </div>

        <div className="tm-agent-test">
          <span className="tm-label">Test Agent</span>
          <div className="tm-chat-head">
            <span className="tm-avatar"><User size={10} /></span>
            <span className="tm-chat-who">
              <span className="tm-chat-name">AI Agent</span>
              <span className="tm-chat-status">Online</span>
            </span>
          </div>
          <div className="tm-chat">
            <span className="tm-msg tm-msg-in">Hi! How can I help you today?</span>
            <span className="tm-msg tm-msg-out">I&rsquo;m interested in your services.</span>
            <span className="tm-msg tm-msg-in">Great! May I ask what you need help with?</span>
            <span className="tm-typing">
              <span className="tm-avatar sm"><User size={9} /></span>
              <span className="tm-dots"><i /><i /><i /></span>
            </span>
          </div>
          <div className="tm-chat-input">
            <span>Type a message...</span>
            <span className="tm-send"><Send size={10} /></span>
          </div>
        </div>
      </div>
    </>
  )
}

/* --- 03. System overview -------------------------------------------------- */

const STATS = [
  { label: 'Active Workflows', value: '128', delta: '+12% from last month' },
  { label: 'AI Agents', value: '18', delta: '+8% from last month' },
  { label: 'Contacts', value: '2,543', delta: '+10% from last month' },
  { label: 'Appointments', value: '426', delta: '+19% from last month' },
]

const ACTIVITY = [
  { text: 'Workflow "New Lead" updated', time: '2h ago' },
  { text: 'AI Agent "Lead Qualifier" improved', time: '5h ago' },
  { text: 'New automation published', time: '1d ago' },
  { text: 'Team training session completed', time: '1d ago' },
  { text: 'New feature released', time: '2d ago' },
]

export function OverviewMock() {
  return (
    <>
      <div className="tm-head">
        <span className="tm-head-title">System Overview</span>
      </div>

      <div className="tm-stat-grid">
        {STATS.map((stat) => (
          <div className="tm-stat" key={stat.label}>
            <span className="tm-stat-label">{stat.label}</span>
            <span className="tm-stat-value">{stat.value}</span>
            <span className="tm-stat-delta">{stat.delta}</span>
          </div>
        ))}
      </div>

      <div className="tm-lower">
        <div className="tm-panel">
          <span className="tm-panel-title">Recent Activity</span>
          <div className="tm-activity">
            {ACTIVITY.map((row) => (
              <div className="tm-activity-row" key={row.text}>
                <span className="tm-activity-mark" />
                <span className="tm-activity-text">{row.text}</span>
                <span className="tm-activity-time">{row.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tm-side-col">
          <div className="tm-panel">
            <span className="tm-panel-title">Upcoming Training</span>
            <div className="tm-training">
              <span className="tm-training-icon"><Calendar size={12} /></span>
              <span className="tm-training-copy">
                <span className="tm-training-name">Workflow Optimization</span>
                <span className="tm-training-when">Jun 5, 2024 &middot; 3:00 PM</span>
              </span>
            </div>
            <span className="tm-join">Join Session</span>
          </div>

          <div className="tm-panel">
            <span className="tm-panel-title">Platform Updates</span>
            <div className="tm-update">
              <span className="tm-update-tag">v2.0</span>
              <span className="tm-update-copy">
                <span className="tm-update-name">v2.0.45</span>
                <span className="tm-update-link">See what&rsquo;s new</span>
              </span>
              <ChevronRight size={12} className="tm-update-chev" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
