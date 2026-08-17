import { Bot, Code2, Headphones, Mail, MessageSquare, Settings, Share2, User } from 'lucide-react'
import './home-hero-deck.css'
import './hero-automation-core.css'


/* --- Geometry ------------------------------------------------------------ */
const VW = 720
const VH = 460

const CARD = { x: 249, y: 176, w: 222, h: 108 }

const NODES = [
  {
    key: 'automation', label: 'Automation', color: '#2563eb', Icon: Settings,
    anchor: 'center', x: 360, y: 40,
    hub: { x: 360, y: 168 },
    d: 'M 360 168 L 360 70',
  },
  {
    key: 'ai', label: 'AI Agents', color: '#7c3aed', Icon: Bot,
    anchor: 'left', x: 488, y: 122,
    hub: { x: 416, y: 168 },
    d: 'M 416 168 C 416 142, 434 122, 488 122',
  },
  {
    key: 'email', label: 'Email Campaign ', color: '#2563eb', Icon: Mail,
    anchor: 'left', x: 575, y: 230,
    hub: { x: 479, y: 230 },
    d: 'M 479 230 L 575 230',
  },
  {
    key: 'sms', label: 'SMS Campaign', color: '#16a34a', Icon: MessageSquare,
    anchor: 'left', x: 488, y: 338,
    hub: { x: 416, y: 292 },
    d: 'M 416 292 C 416 318, 434 338, 488 338',
  },
  {
    key: 'social', label: 'Social Media', color: '#ef4444', Icon: Share2,
    anchor: 'center', x: 360, y: 420,
    hub: { x: 360, y: 292 },
    d: 'M 360 292 L 360 390',
  },
  {
    key: 'web', label: 'Software Development', color: '#f97316', Icon: Code2,
    anchor: 'right', x: 232, y: 338,
    hub: { x: 304, y: 292 },
    d: 'M 304 292 C 304 318, 286 338, 232 338',
  },
  {
    key: 'crm', label: 'CRM Setup', color: '#7c3aed', Icon: User,
    anchor: 'right', x: 145, y: 230,
    hub: { x: 241, y: 230 },
    d: 'M 241 230 L 145 230',
  },
  {
    key: 'support', label: '24/7 Support System', color: '#16a34a', Icon: Headphones,
    anchor: 'right', x: 232, y: 122,
    hub: { x: 304, y: 168 },
    d: 'M 304 168 C 304 142, 286 122, 232 122',
  },
]

const pct = (v, total) => `${(v / total) * 100}%`

function placement(node) {
  const top = pct(node.y, VH)
  if (node.anchor === 'left') return { left: pct(node.x, VW), top }
  if (node.anchor === 'right') return { right: pct(VW - node.x, VW), top }
  return { left: pct(node.x, VW), top }
}

// One lap of the ring, and the gap between consecutive nodes firing. Also
// declared in hero-automation-core.css; keep the two in step.
const LAP_S = 4.8
const STAGGER_S = LAP_S / NODES.length

const ARIA_LABEL =
  'GHL Prime powers CRM, automation, AI agents, email and SMS campaigns, '
  + 'social media, web development, and 24/7 support, all from one platform.'

export default function HeroAutomationCore() {
  return (
    <div className="hac" role="img" aria-label={ARIA_LABEL}>
      <div className="hac-stage" aria-hidden="true">
        <span className="hac-wash" />
        <span className="hac-halo" />

        <svg className="hac-wires" viewBox={`0 0 ${VW} ${VH}`} fill="none">
          {/* Faint dotted guide rings, centred on the card. */}
          <circle className="hac-ring" cx="360" cy="230" r="168" />
          <circle className="hac-ring hac-ring-2" cx="360" cy="230" r="212" />

          {NODES.map((node, index) => (
            <g key={node.key} className="hac-lane" style={{ '--tint': node.color }}>
              <path className="hac-line" d={node.d} />
              {/* The port on the card's edge. It ignites at the instant its
                  pulse departs, so the eye reads the logo as the origin
                  rather than the pulse as just appearing mid-air. */}
              <circle
                className="hac-hub"
                cx={node.hub.x} cy={node.hub.y} r="3.4"
                style={{ animationDelay: `${index * STAGGER_S}s` }}
              />
              {/* The pulse, in two layers: a wide blurred beam and a thin
                  bright core. One layer alone reads as a coloured dash;
                  together they read as travelling light. pathLength="100"
                  normalises every connector to the same 0-100 scale, so one
                  dash pattern drives all eight whatever their real length. */}
              <path
                className="hac-pulse hac-pulse-glow"
                d={node.d}
                pathLength="100"
                style={{ animationDelay: `${index * STAGGER_S}s` }}
              />
              <path
                className="hac-pulse hac-pulse-core"
                d={node.d}
                pathLength="100"
                style={{ animationDelay: `${index * STAGGER_S}s` }}
              />
            </g>
          ))}
        </svg>

        {/* The source. Sits above the SVG layer, and every connector already
            stops short of it, so no line can cross the logo. */}
        <div
          className="hac-core"
          // style={{
          //   left: pct(CARD.x, VW),
          //   top: pct(CARD.y, VH),
          //   width: pct(CARD.w, VW),
          //   height: pct(CARD.h, VH),
          // }}
          style={{left: "38.5833%",top: "39.2609%",width: "23.8333%",height: "20.4783%"}}
        >
          <span className="hac-core-emit" />
          <span className="hac-core-card">
            <img
              className="hac-core-logo"
              src="/ghl-prime-logo.png"
              alt=""
              width="860"
              height="300"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {/* <span className="hac-core-tagline">One Platform. <br/> Limitless Possibilities.</span> */}
          </span>
        </div>

        {/* Service nodes: a tinted container holding the icon tile, the
            service name, and the status dot. */}
        {NODES.map((node, index) => (
          <div
            key={node.key}
            className={`hac-node hac-node-${node.anchor}`}
            style={{
              ...placement(node),
              '--tint': node.color,
              animationDelay: `${index * STAGGER_S}s`,
            }}
          >
            <span className="hac-node-tile">
              <node.Icon size={18} strokeWidth={1.9} />
            </span>
            <span className="hac-node-label">{node.label}</span>
            {/* <span className="hac-node-dot" /> */}
          </div>
        ))}
      </div>
    </div>
  )
}
