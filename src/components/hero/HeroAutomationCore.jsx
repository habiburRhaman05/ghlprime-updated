import { useEffect, useMemo, useState } from 'react'
import { Bot, Code2, Headphones, Mail, MessageSquareText, Share2, Users, Workflow, Zap } from 'lucide-react'
import './home-hero-deck.css'
import './hero-automation-core.css'

/*
 * The homepage hero visual -- "Automation Core".
 *
 * Replaces the old delivery-deck composition, which pinned three satellite
 * cards at three unrelated offsets over a rotated plinth and so never
 * resolved into a stable shape. Here every element is placed from ONE
 * origin (the core, at CENTER) on ONE ellipse, so misalignment is not
 * possible by construction -- the geometry below is the single source of
 * truth for both the SVG wires and the absolutely-positioned DOM cards.
 *
 * What it says: GHL Prime sits at the centre and drives every service the
 * agency sells -- CRM, automations, AI agents, email, SMS, social, web dev,
 * and 24/7 support. One hue per lane so the spread reads instantly.
 *
 * Everything inside is decorative: the wrapper carries role="img" + a label
 * and the entire subtree is aria-hidden, so screen readers get one sentence
 * instead of eight invented service nodes.
 *
 * Hard constraint: no <p> anywhere in here. The homepage schema's
 * `speakable` selector is `.hero p` (HomePage.jsx), so a paragraph inside
 * this component would silently leak mock UI text into the speakable
 * extract. Use span/div only.
 */

/* --- Geometry -------------------------------------------------------------
 * All numbers are in viewBox units. The stage carries the same aspect ratio
 * as the viewBox, so a percentage derived from these coordinates lands on
 * exactly the same pixel as the SVG path that points at it. */
const VIEW_W = 560
const VIEW_H = 460
const CX = VIEW_W / 2
const CY = VIEW_H / 2
const RX = 214
const RY = 164
const CORE_R = 58

const SERVICES = [
  { key: 'automation', label: 'Automation', color: '#1684ea', Icon: Workflow },
  { key: 'ai', label: 'AI Agents', color: '#6366f1', Icon: Bot },
  { key: 'email', label: 'Email', color: '#06b6d4', Icon: Mail },
  { key: 'sms', label: 'SMS', color: '#10b981', Icon: MessageSquareText },
  { key: 'social', label: 'Social', color: '#f43f5e', Icon: Share2 },
  { key: 'web', label: 'Web Dev', color: '#f59e0b', Icon: Code2 },
  { key: 'crm', label: 'CRM', color: '#8b5cf6', Icon: Users },
  { key: 'support', label: '24/7 Support', color: '#14b8a6', Icon: Headphones },
]

// Start at the top and run clockwise, so the eight lanes land on the four
// cardinal and four diagonal axes -- the arrangement the eye reads as
// deliberate rather than scattered.
const STEP = 360 / SERVICES.length

const NODES = SERVICES.map((service, index) => {
  const angle = (-90 + index * STEP) * (Math.PI / 180)
  const x = CX + Math.cos(angle) * RX
  const y = CY + Math.sin(angle) * RY
  // Where the wire starts: on the rim of the core, not its centre, so the
  // stroke never shows through the translucent disc.
  const dx = x - CX
  const dy = y - CY
  const dist = Math.hypot(dx, dy)
  return {
    ...service,
    x,
    y,
    leftPct: (x / VIEW_W) * 100,
    topPct: (y / VIEW_H) * 100,
    x0: CX + (dx / dist) * CORE_R,
    y0: CY + (dy / dist) * CORE_R,
    wireLen: dist - CORE_R,
  }
})

// Ramanujan's approximation -- needed as a concrete number because the ring
// "sweep" is a dash pattern that has to add up to the full circumference or
// it visibly stutters where the path closes.
function ellipsePerimeter(rx, ry) {
  const h = ((rx - ry) / (rx + ry)) ** 2
  return Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
}

const OUTER_RING = ellipsePerimeter(RX, RY)
const INNER_RING = ellipsePerimeter(RX * 0.56, RY * 0.56)

const STATS = [
  { label: 'Workflows live', value: 128, format: (v) => String(v) },
  { label: 'Tickets solved', value: 4900, format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)) },
  { label: 'First reply', value: 6, format: (v) => `${v}m` },
]

const CYCLE_MS = 2000

// Mirrors the matchMedia pattern already used by WhatWeAreSlider.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (event) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

function useCountUp(target, enabled, delay) {
  const [value, setValue] = useState(enabled ? 0 : target)

  useEffect(() => {
    if (!enabled) {
      setValue(target)
      return undefined
    }

    let frame = null
    let start = null

    const startTimer = window.setTimeout(() => {
      const step = (now) => {
        if (start === null) start = now
        const progress = Math.min((now - start) / 1100, 1)
        // easeOutCubic -- fast arrival, soft landing.
        setValue(Math.round(target * (1 - (1 - progress) ** 3)))
        if (progress < 1) frame = window.requestAnimationFrame(step)
      }
      frame = window.requestAnimationFrame(step)
    }, delay)

    return () => {
      window.clearTimeout(startTimer)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [target, enabled, delay])

  return value
}

function StatTile({ stat, animate, delay }) {
  const value = useCountUp(stat.value, animate, delay)

  return (
    <div className="hac-stat">
      <strong className="hac-stat-value">{stat.format(value)}</strong>
      <span className="hac-stat-label">{stat.label}</span>
    </div>
  )
}

export default function HeroAutomationCore() {
  const reduced = usePrefersReducedMotion()
  const [step, setStep] = useState(0)
  // Hover wins over the cycle, so pointing at a lane holds it lit instead of
  // fighting the timer.
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    if (reduced) return undefined
    const id = setInterval(() => setStep((current) => (current + 1) % NODES.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [reduced])

  const activeKey = hovered ?? (reduced ? null : NODES[step].key)

  const label = useMemo(() => (
    'GHL Prime automation core: CRM, automation workflows, AI agents, email and SMS campaigns, '
    + 'social media, web development, and 24/7 white-label support, all run by one expert team.'
  ), [])

  return (
    <div className="hac" role="img" aria-label={label}>
      <div className="hac-stage" aria-hidden="true" onPointerLeave={() => setHovered(null)}>
        <span className="hac-wash" />
        <span className="hac-halo" />

        <svg className="hac-wires" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none">
          <defs>
            {NODES.map((node) => (
              <linearGradient
                key={node.key}
                id={`hac-grad-${node.key}`}
                gradientUnits="userSpaceOnUse"
                x1={node.x0} y1={node.y0} x2={node.x} y2={node.y}
              >
                <stop offset="0%" stopColor={node.color} stopOpacity="0.05" />
                <stop offset="100%" stopColor={node.color} stopOpacity="0.85" />
              </linearGradient>
            ))}
          </defs>

          {/* Orbit rings. Static and faint -- they exist to make the ellipse
              legible so the node placement reads as a system. */}
          <ellipse className="hac-ring" cx={CX} cy={CY} rx={RX} ry={RY} />
          <ellipse className="hac-ring" cx={CX} cy={CY} rx={RX * 0.56} ry={RY * 0.56} />

          {/* One bright arc chasing each ring, in opposite directions. */}
          <ellipse
            className="hac-sweep"
            cx={CX} cy={CY} rx={RX} ry={RY}
            style={{ strokeDasharray: `${OUTER_RING * 0.11} ${OUTER_RING}`, '--ring': OUTER_RING }}
          />
          <ellipse
            className="hac-sweep hac-sweep-reverse"
            cx={CX} cy={CY} rx={RX * 0.56} ry={RY * 0.56}
            style={{ strokeDasharray: `${INNER_RING * 0.14} ${INNER_RING}`, '--ring': INNER_RING }}
          />

          {NODES.map((node, index) => {
            const isActive = activeKey === node.key
            return (
              <g key={node.key} className={`hac-lane${isActive ? ' is-active' : ''}`}>
                <line
                  className="hac-wire"
                  x1={node.x0} y1={node.y0} x2={node.x} y2={node.y}
                  stroke={`url(#hac-grad-${node.key})`}
                />
                {/* The packet: a short dash travelling core -> service. */}
                <line
                  className="hac-packet"
                  x1={node.x0} y1={node.y0} x2={node.x} y2={node.y}
                  stroke={node.color}
                  style={{ '--len': node.wireLen, '--delay': `${index * 0.32}s` }}
                />
              </g>
            )
          })}
        </svg>

        <div className="hac-core">
          <span className="hac-core-ring" />
          <span className="hac-core-ring hac-core-ring-2" />
          <span className="hac-core-disc">
            <span className="hac-core-sheen" />
            <Zap className="hac-core-bolt" size={22} strokeWidth={2.4} />
            <span className="hac-core-name">GHL PRIME</span>
          </span>
        </div>

        {/* Two layers, because two transforms have to coexist: the outer one
            owns placement + the entrance pop (whose `both` fill would
            otherwise outrank any later transform), the inner one owns the
            active-lane lift. */}
        {NODES.map((node, index) => {
          const isActive = activeKey === node.key
          return (
            <div
              key={node.key}
              className="hac-node"
              style={{
                left: `${node.leftPct}%`,
                top: `${node.topPct}%`,
                '--tint': node.color,
                '--i': index,
              }}
              onPointerEnter={() => setHovered(node.key)}
            >
              <span className={`hac-node-pill${isActive ? ' is-active' : ''}`}>
                <span className="hac-node-icon"><node.Icon size={15} /></span>
                <span className="hac-node-label">{node.label}</span>
              </span>
            </div>
          )
        })}
      </div>

      <div className="hac-stats" aria-hidden="true">
        <span className="hac-live">
          <span className="hac-live-dot" />
          Live
        </span>
        {STATS.map((stat, index) => (
          <StatTile key={stat.label} stat={stat} animate={!reduced} delay={900 + index * 90} />
        ))}
      </div>
    </div>
  )
}
