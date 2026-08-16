import { Bot, Code2, Headphones, Mail, MessageSquare, Settings, Share2, User } from 'lucide-react'
import './home-hero-deck.css'
import './hero-automation-core.css'

/*
 * The homepage hero visual -- "Power Grid".
 *
 * A compact reproduction of the approved reference: the GHL Prime card at
 * the centre as the power source, eight service nodes ringing it, and a
 * glowing pulse leaving the card and travelling outward along each connector
 * in turn.
 *
 * WHY THE GEOMETRY IS NOT A UNIFORM SCALE-DOWN OF THE REFERENCE
 * The reference is drawn at 1224px wide. Our hero column is roughly 590px,
 * so scaling it uniformly would put the service labels at ~8px and the
 * whole thing would be unreadable. Instead the proportions are rebuilt at
 * our own width: type and tiles stay at readable sizes and the empty space
 * between them is tightened. Same composition, genuinely more compact.
 *
 * SYMMETRY IS EXPLICIT, NOT INCIDENTAL
 *   - Rows sit at y = 40 / 122 / 230 / 338 / 420, mirrored about the card
 *     axis at y = 230.
 *   - Automation and Social are anchored to the card's vertical axis
 *     (x = 360) by their container centre, so they line up with each other
 *     and with the card no matter how long their labels are.
 *   - Side nodes are anchored by their CENTRE-FACING EDGE at a mirrored x
 *     (145/575 and 232/488). Anchoring by edge rather than by centre is what
 *     makes the eight connectors exact mirror images: label length then
 *     changes how far a node extends outward, never where its connector
 *     meets it.
 *
 * CONNECTORS NEVER ENTER THE CARD. Every path stops 8 units outside the
 * card's edge, and the card is painted on a higher layer than the SVG, so
 * the logo reads as a separate object sitting above the grid.
 *
 * POWER READS AS COMING FROM THE LOGO because three things fire together:
 * the card's glow swells once per BEAT (lap / 8, i.e. once per departing
 * pulse), the port on the card edge ignites, and the pulse leaves. Tying the
 * card's glow to the lap instead meant it swelled once while eight pulses
 * departed, which is why the effect previously did not read.
 *
 * Deliberately no JS: no timers, no state, no listeners. The hero is the LCP
 * region, so the animation is pure CSS keyframes that paint on the first
 * frame instead of waiting for hydration.
 *
 * Everything inside is decorative: the wrapper carries role="img" + a label
 * and the entire subtree is aria-hidden.
 *
 * Hard constraint: no <p> anywhere in here. The homepage schema's
 * `speakable` selector is `.hero p` (HomePage.jsx), so a paragraph here
 * would leak decorative text into the speakable extract. Use span/div only.
 */

/* --- Geometry ------------------------------------------------------------ */
const VW = 720
const VH = 460

// Card: centre (360, 230), 222 x 108, so its edges are x 249/471 and
// y 176/284. Every `hub` below sits 8 units outside one of those edges
// (168, 292, 241, 479): close enough that a pulse visibly launches off the
// card itself, far enough that no connector touches the logo.
const CARD = { x: 249, y: 176, w: 222, h: 108 }

/* Listed CLOCKWISE FROM THE TOP -- that order is what the staggered delay
 * walks through, so the pulse sweeps around the ring rather than firing at
 * random points.
 *
 * `anchor` decides which edge is pinned to `x`:
 *   left   -> node's left edge sits at x, grows rightward  (right-hand side)
 *   right  -> node's right edge sits at x, grows leftward  (left-hand side)
 *   center -> node is centred on x                         (top and bottom)
 *
 * `hub` is where the connector meets the card's perimeter; `d` runs hub ->
 * node so the pulse travels outward. */
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
    key: 'email', label: 'Email', color: '#2563eb', Icon: Mail,
    anchor: 'left', x: 575, y: 230,
    hub: { x: 479, y: 230 },
    d: 'M 479 230 L 575 230',
  },
  {
    key: 'sms', label: 'SMS', color: '#16a34a', Icon: MessageSquare,
    anchor: 'left', x: 488, y: 338,
    hub: { x: 416, y: 292 },
    d: 'M 416 292 C 416 318, 434 338, 488 338',
  },
  {
    key: 'social', label: 'Social', color: '#ef4444', Icon: Share2,
    anchor: 'center', x: 360, y: 420,
    hub: { x: 360, y: 292 },
    d: 'M 360 292 L 360 390',
  },
  {
    key: 'web', label: 'Web Dev', color: '#f97316', Icon: Code2,
    anchor: 'right', x: 232, y: 338,
    hub: { x: 304, y: 292 },
    d: 'M 304 292 C 304 318, 286 338, 232 338',
  },
  {
    key: 'crm', label: 'CRM', color: '#7c3aed', Icon: User,
    anchor: 'right', x: 145, y: 230,
    hub: { x: 241, y: 230 },
    d: 'M 241 230 L 145 230',
  },
  {
    key: 'support', label: '24/7 Support', color: '#16a34a', Icon: Headphones,
    anchor: 'right', x: 232, y: 122,
    hub: { x: 304, y: 168 },
    d: 'M 304 168 C 304 142, 286 122, 232 122',
  },
]

const pct = (v, total) => `${(v / total) * 100}%`

// Pins the node by whichever edge faces the card, so a longer label extends
// outward instead of dragging the connector's meeting point with it.
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
            <span className="hac-node-dot" />
          </div>
        ))}
      </div>
    </div>
  )
}
