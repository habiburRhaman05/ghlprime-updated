'use client'

import { useState, Fragment, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useSpring, useInView } from 'framer-motion'
import {
  ArrowRight, ChevronRight, CheckCircle2, Check, Code2, Terminal, LayoutDashboard,
  Plug, Users, Webhook, Workflow, Rocket, Bot, MessageSquare, Phone, Mail,
  Headphones, ShieldCheck, Database, Gauge, GitBranch, Boxes, Cpu, Sparkles,
  FileCode2, PenTool, Layers, MonitorSmartphone, Zap, LifeBuoy, Clock, BarChart3,
  Lock, Server, Building2, Briefcase, Home, Settings, Network, Wand2,
  Inbox, UserCheck, CalendarCheck, Send,
  FileText, Tag, DollarSign, Bell, Calendar, CircleDollarSign,
} from 'lucide-react'
import Tilt from './motion3d/Tilt'
import TiltCard from './motion3d/TiltCard'
import SiteFooter from './SiteFooter'
import FaqSection from './FaqSection'
import ShippedEvidenceSection from './ShippedEvidenceSection'
import { pageKeyForServiceSlug } from '../data/showcasePages'
import '../styles/service-detail.css'
import HeroSetupCard from './hero/HeroSetupCard'
import HeroWorkflowLive from './hero/HeroWorkflowLive'
import HeroPhoneAgent from './hero/HeroPhoneAgent'
import HeroClientPortal from './hero/HeroClientPortal'
import HeroFigmaCode from './hero/HeroFigmaCode'
import HeroAppTabs from './hero/HeroAppTabs'
import './hero/hero-mockup.css'
import ServiceSurveyForm from './ServiceSurveyForm'
import { SERVICE_FORMS } from '../data/serviceForms'

const SITE = 'https://ghlprime.com'
const UPWORK = 'https://www.upwork.com/agencies/ghlprime/'

const ICONS = {
  ArrowRight, CheckCircle2, Check, Code2, Terminal, LayoutDashboard, Plug, Users,
  Webhook, Workflow, Rocket, Bot, MessageSquare, Phone, Mail, Headphones,
  ShieldCheck, Database, Gauge, GitBranch, Boxes, Cpu, Sparkles, FileCode2,
  PenTool, Layers, MonitorSmartphone, Zap, LifeBuoy, Clock, BarChart3, Lock,
  Server, Building2, Briefcase, Home, Settings, Network, Wand2,
  Inbox, UserCheck, CalendarCheck, Send,
  FileText, Tag, DollarSign, Bell, Calendar, CircleDollarSign,
}

function Icon({ name, size = 20 }) {
  const Cmp = ICONS[name] || Sparkles
  return <Cmp size={size} />
}

// Inline [label](href) -> Link / anchor.
function rich(text) {
  const parts = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m
  let key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const label = m[1]
    const href = m[2]
    if (href.startsWith('/')) parts.push(<Link key={`l${key++}`} href={href}>{label}</Link>)
    else parts.push(<a key={`a${key++}`} href={href} target="_blank" rel="noopener noreferrer">{label}</a>)
    last = re.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

const KW = new Set([
  'const', 'let', 'var', 'await', 'async', 'function', 'return', 'new', 'import',
  'from', 'export', 'CREATE', 'TABLE', 'ALTER', 'ENABLE', 'ROW', 'LEVEL',
  'SECURITY', 'PRIMARY', 'KEY', 'NOT', 'NULL', 'REFERENCES', 'DEFAULT',
])

// Lightweight, render-safe syntax highlighter for the light code cards.
function highlight(line) {
  try {
    const trimmed = line.trimStart()
    if (trimmed.startsWith('//') || trimmed.startsWith('--') || trimmed.startsWith('#')) {
      return [<span className="c-com" key="c">{line}</span>]
    }
    const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\/\/.*$)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$]+)/g
    const toks = []
    let m
    while ((m = re.exec(line)) !== null) toks.push(m[0])
    const out = []
    for (let i = 0; i < toks.length; i++) {
      const tk = toks[i]
      if (/^["']/.test(tk)) { out.push(<span className="c-str" key={i}>{tk}</span>); continue }
      if (tk.startsWith('//')) { out.push(<span className="c-com" key={i}>{tk}</span>); continue }
      if (/^[A-Za-z_$]/.test(tk)) {
        if (tk === 'true' || tk === 'false') { out.push(<span className="c-bool" key={i}>{tk}</span>); continue }
        if (KW.has(tk)) { out.push(<span className="c-key" key={i}>{tk}</span>); continue }
        let j = i + 1
        while (j < toks.length && /^\s+$/.test(toks[j])) j++
        const nxt = j < toks.length ? toks[j] : ''
        if (nxt.startsWith(':')) { out.push(<span className="c-prop" key={i}>{tk}</span>); continue }
        if (nxt.startsWith('(')) { out.push(<span className="c-fn" key={i}>{tk}</span>); continue }
        out.push(<span key={i}>{tk}</span>); continue
      }
      out.push(<span key={i}>{tk}</span>)
    }
    return out
  } catch {
    return [line]
  }
}

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

// Hero copy arrives as a 3D unfold: each line hinges down from the one above
// it. staggerChildren needs variants on both ends, so the column holds the
// timing and each child holds the rotation.
const heroStack = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const heroLine = {
  hidden: { opacity: 0, rotateX: -50, y: 22 },
  show: {
    opacity: 1, rotateX: 0, y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 },
  },
}
const heroLineProps = { variants: heroLine, style: { transformOrigin: 'top center', transformPerspective: 1000 } }

// Staggered reveal for card grids and checklists. staggerChildren only works
// when both ends of the tree use variants, so the parent carries the timing
// and the child carries the actual transition.
const revealGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}
const revealItem = {
  hidden: { opacity: 0, rotateX: -55, y: 18 },
  show: {
    opacity: 1, rotateX: 0, y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 },
  },
}
// Palette cycle for the config-driven icon tiles (see styles/icon-system.css).
const TONES = ['ic-sky', 'ic-violet', 'ic-amber', 'ic-teal', 'ic-indigo', 'ic-rose', 'ic-emerald', 'ic-blue']
const tone = (i) => TONES[i % TONES.length]

const groupProps = {
  variants: revealGroup,
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.15 },
}

// Card grids animate per card rather than as one group: a grid two or three
// rows deep is taller than the viewport, so a container-level trigger makes
// the top row sit and wait for the container's threshold. Each card watching
// its own position removes that lag. `once: false` replays the reveal every
// time the card comes back into view. `cols` only staggers within a row, so
// the delay never accumulates down the grid.
const cardReveal = (i, cols) => ({
  style: { transformOrigin: 'top center', transformPerspective: 1100 },
  initial: { opacity: 0, rotateX: -44, y: 24 },
  whileInView: { opacity: 1, rotateX: 0, y: 0 },
  viewport: { once: false, amount: 0.25 },
  transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: (i % cols) * 0.08 },
})

// The process section as a vertical timeline: a rail down the left whose
// coloured fill tracks scroll position through the section, and a node per
// step that lights up as that step comes into view.
// Swings in from the rail on its left edge rather than sliding up, so each
// card reads as hinged to the timeline it hangs off.
const tlStep = {
  hidden: { opacity: 0, rotateY: -20, x: 28 },
  show: { opacity: 1, rotateY: 0, x: 0, transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9, when: 'beforeChildren' } },
}
const tlNode = {
  hidden: { scale: 0.4, borderColor: 'rgba(226, 232, 240, 1)', boxShadow: '0 0 0 0 rgba(22, 132, 234, 0)' },
  show: {
    scale: 1,
    borderColor: 'rgba(22, 132, 234, 1)',
    boxShadow: '0 0 0 6px rgba(22, 132, 234, 0.12)',
    transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 },
  },
}

function ProcessSteps({ steps }) {
  const reduceMotion = useReducedMotion()
  const railRef = useRef(null)
  // Maps "section entering the lower quarter of the viewport" -> "section
  // leaving the upper half" onto 0..1, so the rail reads empty on arrival
  // and is full by the time the last step has been read.
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 78%', 'end 55%'] })
  const railFill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })

  return (
    <div className="svc-timeline" ref={railRef}>
      <span className="svc-timeline-rail" aria-hidden="true">
        <motion.span className="svc-timeline-fill" style={{ scaleY: reduceMotion ? 1 : railFill }} />
      </span>
      {steps.map((step, i) => (
        <motion.div
          className="svc-tl-step"
          key={step.title}
          variants={tlStep}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          style={{ transformOrigin: 'left center', transformPerspective: 1200 }}
        >
          <motion.span className="svc-tl-node" variants={tlNode} aria-hidden="true">
            <span className="svc-tl-node-core" />
          </motion.span>
          <Tilt className="svc-tl-card" max={4}>
            <div className="svc-tl-head">
              <span className="svc-tl-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
            </div>
            <div className="svc-tl-body">
              <p>{step.text}</p>
              {step.meta ? <span className="svc-tl-meta">{step.meta}</span> : null}
            </div>
          </Tilt>
        </motion.div>
      ))}
    </div>
  )
}

// Hero credential pills. Shared by both hero layouts (with and without the
// survey form) so the two never drift apart.
function HeroBadges({ badges }) {
  if (!badges) return null
  return (
    <motion.div className="svc-badges" {...groupProps}>
      {badges.map((b) => (
        <motion.span
          className="svc-badge"
          key={b}
          variants={revealItem}
          style={{ transformPerspective: 600, transformOrigin: 'top center' }}
          whileHover={{ z: 18, rotateX: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        >
          <Check size={14} className="svc-badge-check" aria-hidden="true" />
          {b}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Types `code` out character by character the first time the card scrolls
// into view, then holds the finished sample. Returns how many characters of
// the source are currently visible; `lines.length` worth of newlines count as
// characters too, so blank lines pause for a beat like real typing does.
const TYPE_CPS = 260

function useTypedLength(text, active) {
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    if (!active) return undefined
    if (typed >= text.length) return undefined
    let frame
    let previous
    let carry = 0
    const step = (now) => {
      if (previous === undefined) previous = now
      carry += ((now - previous) / 1000) * TYPE_CPS
      previous = now
      if (carry >= 1) {
        const chars = Math.floor(carry)
        carry -= chars
        setTyped((n) => Math.min(text.length, n + chars))
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // `typed` is deliberately out of the dep list: it changes every frame and
    // would restart the loop each time. The guard above reads it once, which
    // is all that is needed to stop scheduling after the sample is complete.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active])
  return typed
}

function CodeCard({ filename, code }) {
  // Typing runs against the same trailing-newline-stripped string the lines
  // are split from, so the final character typed is the final character
  // rendered -- counting against the raw `code` leaves the caret one short
  // of the end forever.
  const source = useMemo(() => code.replace(/\n+$/, ''), [code])
  const lines = useMemo(() => source.split('\n'), [source])
  const reduceMotion = useReducedMotion()
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, amount: 0.35 })
  // +1 per line for the newline the reader "presses" at the end of it.
  // Character index each line starts at, so a line can work out how much of
  // itself is visible without the map callback carrying a running total.
  const starts = useMemo(() => {
    const out = []
    let n = 0
    for (const line of lines) { out.push(n); n += line.length + 1 }
    return out
  }, [lines])
  const typed = useTypedLength(source, inView && !reduceMotion)
  const done = reduceMotion || typed >= source.length

  return (
    <div className="m3d-float" ref={cardRef}>
    <Tilt className={`svc-codecard${done ? '' : ' is-typing'}`}>
      <div className="svc-codecard-head">
        <span className="svc-codedots"><span /><span /><span /></span>
        <span className="svc-codefile">{filename}</span>
      </div>
      <pre className="svc-codebody" role="img" aria-label={source}>
        {lines.map((line, i) => {
          const available = done ? line.length : typed - starts[i]
          const onCursorLine = !done && available >= 0 && available <= line.length
          // Every row renders whether or not it has content yet, so the card
          // is full height from the first frame and the column beside it
          // never jumps as lines arrive.
          return (
            <span className="ln" key={i} aria-hidden="true">
              {available > 0 ? highlight(line.slice(0, Math.min(line.length, available))) : null}
              {onCursorLine ? <span className="svc-caret" /> : null}
            </span>
          )
        })}
      </pre>
    </Tilt>
    </div>
  )
}

function HelpdeskCard({ data }) {
  return (
    <div className="svc-helpdesk" role="img" aria-label="White-label support inbox showing tickets resolved by GHL Prime under your brand">
      <div className="svc-helpdesk-head">
        <span className="svc-codedots"><span /><span /><span /></span>
        <span className="svc-helpdesk-title">{data.title}</span>
      </div>
      {data.tickets.map((t) => (
        <div className="svc-ticket" key={t.id}>
          <span className="svc-ticket-id">{t.id}</span>
          <span className="svc-ticket-subject">{t.subject}</span>
          <span className={`svc-ticket-status ${t.state === 'done' ? 'done' : 'prog'}`}>
            {t.state === 'done' ? <Check size={13} /> : <span className="pdot" />}{t.label}
          </span>
          <span className="svc-ticket-time">{t.time}</span>
        </div>
      ))}
      <div className="svc-helpdesk-foot">{data.footer}</div>
    </div>
  )
}

function FigmaSplit() {
  return (
    <div className="svc-figma" role="img" aria-label="Figma design wireframe converted into a production-ready coded interface">
      <div className="svc-figma-pane design">
        <span className="svc-figma-label">Design</span>
        <div className="wf bar" />
        <div className="wf row"><div className="wf block" /><div className="wf block" /></div>
        <div className="wf btn" />
      </div>
      <div className="svc-figma-arrow"><ArrowRight size={26} /></div>
      <div className="svc-figma-pane prod">
        <span className="svc-figma-label">Production</span>
        <div className="pf-bar"><span className="pf-dot" /><span className="pf-dot" /><span className="pf-dot" /></div>
        <div className="pf-row"><div className="pf-card" /><div className="pf-card" /></div>
        <div className="pf-btn" />
      </div>
    </div>
  )
}

// 2D, borderless workflow graph that "draws itself" once when scrolled into
// view (nodes pop in, curved connectors draw). Random per-node delay makes the
// build feel organic. Respects prefers-reduced-motion (renders finished).
const WF_W = 660
const WF_H = 430
const WF_NODES = [
  { id: 'a', label: 'Form Submitted', color: '#8b5cf6', Icon: FileText, x: 80, y: 215, layer: 0 },
  { id: 'b', label: 'Send SMS', color: '#06b6d4', Icon: MessageSquare, x: 255, y: 110, layer: 1 },
  { id: 'c', label: 'Add Tag', color: '#10b981', Icon: Tag, x: 255, y: 320, layer: 1 },
  { id: 'd', label: 'Create Opportunity', color: '#3b82f6', Icon: DollarSign, x: 435, y: 110, layer: 2 },
  { id: 'e', label: 'Wait 5 min', color: '#8b5cf6', Icon: Clock, x: 435, y: 320, layer: 2 },
  { id: 'f', label: 'Send Booking Link', color: '#f59e0b', Icon: CalendarCheck, x: 595, y: 215, layer: 3 },
]
const WF_EDGES = [['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'e'], ['d', 'f'], ['e', 'f']]
const WF_SQ = 23 // half of the 46px node square

function wfEdgePath(s, t) {
  const sx = s.x + WF_SQ
  const sy = s.y
  const tx = t.x - WF_SQ
  const ty = t.y
  const dx = Math.max((tx - sx) * 0.55, 26)
  return 'M ' + sx + ',' + sy + ' C ' + (sx + dx) + ',' + sy + ' ' + (tx - dx) + ',' + ty + ' ' + tx + ',' + ty
}

function WorkflowBuilder() {
  const reduce = useReducedMotion()
  const byId = useMemo(() => Object.fromEntries(WF_NODES.map((n) => [n.id, n])), [])
  const delays = useMemo(() => {
    // deterministic per-node jitter (pure + prerender-safe) so the build still
    // feels organic without Math.random firing during render
    const jitter = (s) => { let h = 0; for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 997; return (h % 100) / 100 }
    const d = {}
    for (const n of WF_NODES) d[n.id] = n.layer * 0.26 + jitter(n.id + n.label) * 0.24
    return d
  }, [])
  const vp = { once: true, amount: 0.4 }
  return (
    <div className="wfg-scroll">
      <div className="wfg" role="img" aria-label="A GoHighLevel automation building itself: a form submission branches into send SMS and add tag, then create opportunity and wait, merging into send booking link">
        <svg className="wfg-svg" viewBox={'0 0 ' + WF_W + ' ' + WF_H} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <marker id="wfg-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>
          {WF_EDGES.map(([from, to]) => {
            const s = byId[from]
            const t = byId[to]
            const delay = Math.max(delays[from], delays[to]) + 0.16
            return (
              <g key={from + to}>
                <motion.path
                  d={wfEdgePath(s, t)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  markerEnd="url(#wfg-arrow)"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.9 }}
                  viewport={vp}
                  transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : delay, ease: 'easeInOut' }}
                />
                {!reduce && <path className="wfg-flow" d={wfEdgePath(s, t)} stroke={s.color} />}
              </g>
            )
          })}
        </svg>
        {WF_NODES.map((n) => (
          <div key={n.id} className="wfg-node-pos" style={{ left: ((n.x / WF_W) * 100) + '%', top: ((n.y / WF_H) * 100) + '%' }}>
            <motion.div
              className="wfg-node"
              style={{ background: n.color }}
              initial={reduce ? false : { opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={vp}
              transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : delays[n.id], ease: 'backOut' }}
            >
              <n.Icon size={20} color="#ffffff" />
              <span className="wfg-node-label">{n.label}</span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
const CRMD_NAV = [
  { label: 'Dashboard', Icon: LayoutDashboard, active: true },
  { label: 'Contacts', Icon: Users },
  { label: 'Conversations', Icon: MessageSquare },
  { label: 'Opportunities', Icon: CircleDollarSign },
  { label: 'Calendars', Icon: Calendar },
  { label: 'Automation', Icon: Workflow },
  { label: 'Reporting', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
]

function CrmDashboard() {
  return (
    <div className="crmd" role="img" aria-label="White-labeled GoHighLevel CRM dashboard set up by GHL Prime, showing leads, calls, appointments, opportunities and funnel views under your brand">
      <div className="crmd-side">
        <div className="crmd-logo"><span className="crmd-logo-sq" /><span className="crmd-logo-tx">YourBrand CRM</span></div>
        <div className="crmd-wl">White-labeled for your agency</div>
        <nav className="crmd-nav">
          {CRMD_NAV.map((it) => (
            <span key={it.label} className={`crmd-nav-item${it.active ? ' active' : ''}`}>
              <it.Icon size={15} /> {it.label}
            </span>
          ))}
        </nav>
      </div>
      <div className="crmd-main">
        <div className="crmd-head">
          <span className="crmd-title">Dashboard</span>
          <div className="crmd-head-r">
            <span className="crmd-pill">Last 30 Days ▾</span>
            <span className="crmd-btn">Edit Dashboard</span>
          </div>
        </div>
        <div className="crmd-row">
          <div className="crmd-card crmd-line">
            <span className="crmd-card-title">Leads This Month</span>
            <svg viewBox="0 0 280 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1="25" x2="280" y2="25" stroke="#f1f5f9" />
              <line x1="0" y1="55" x2="280" y2="55" stroke="#f1f5f9" />
              <line x1="0" y1="85" x2="280" y2="85" stroke="#f1f5f9" />
              <path d="M0,80 L56,66 L112,70 L168,30 L224,18 L280,40 L280,100 L0,100 Z" fill="#fce7f3" />
              <polyline points="0,80 56,66 112,70 168,30 224,18 280,40" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="224" cy="18" r="3.5" fill="#ec4899" />
            </svg>
            <div className="crmd-xlabels"><span>Jun 1</span><span>Jun 8</span><span>Jun 15</span><span>Jun 22</span><span>Jun 30</span></div>
          </div>
          <div className="crmd-card crmd-donut">
            <span className="crmd-card-title">Calls by Status</span>
            <div className="crmd-donut-body">
              <div className="crmd-donut-chart">
                <svg viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <g transform="rotate(-90 40 40)">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#06b6d4" strokeWidth="12" strokeDasharray="181.06 7.44" strokeDashoffset="0" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="4.96 183.54" strokeDashoffset="-181.06" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="2.48 186.02" strokeDashoffset="-186.02" />
                  </g>
                </svg>
                <span className="crmd-donut-num">76</span>
              </div>
              <div className="crmd-legend">
                <span><i style={{ background: '#06b6d4' }} />73 Answered</span>
                <span><i style={{ background: '#3b82f6' }} />2 Missed</span>
                <span><i style={{ background: '#8b5cf6' }} />1 Voicemail</span>
              </div>
            </div>
          </div>
        </div>
        <div className="crmd-metrics">
          <div className="crmd-card crmd-metric"><span className="crmd-card-title">Appointments</span><span className="crmd-metric-num">48</span><span className="crmd-metric-up">▲ 12%</span></div>
          <div className="crmd-card crmd-metric"><span className="crmd-card-title">Open Opportunities</span><span className="crmd-metric-num">23</span><span className="crmd-metric-up">▲ 9%</span></div>
          <div className="crmd-card crmd-metric"><span className="crmd-card-title">Funnel Views</span><span className="crmd-metric-num">1.2k</span><span className="crmd-metric-up">▲ 18%</span></div>
        </div>
      </div>
    </div>
  )
}

const WSD_TYPES = {
  Automation: { bg: '#ede9fe', color: '#7c3aed' },
  Setup: { bg: '#dbeafe', color: '#1d4ed8' },
  Access: { bg: '#fef3c7', color: '#b45309' },
  'AI Agent': { bg: '#d1fae5', color: '#065f46' },
  Compliance: { bg: '#fee2e2', color: '#991b1b' },
}
const WSD_TICKETS = [
  { id: '1024', subject: 'How do I trigger a workflow from Zapier?', type: 'Automation', state: 'resolved', status: 'Resolved', time: '2m ago' },
  { id: '1025', subject: 'Twilio SMS not sending on form submit', type: 'Setup', state: 'resolved', status: 'Resolved', time: '8m ago' },
  { id: '1026', subject: "Sub-account user can't log in", type: 'Access', state: 'progress', status: 'In Progress', time: 'just now' },
  { id: '1027', subject: 'AI agent not responding on WhatsApp', type: 'AI Agent', state: 'resolved', status: 'Resolved', time: '14m ago' },
  { id: '1028', subject: 'How to set up A2P compliance?', type: 'Compliance', state: 'resolved', status: 'Resolved', time: '31m ago' },
]

function SupportDesk() {
  return (
    <div className="wsd-wrap">
      <div className="wsd" role="img" aria-label="White-label support inbox branded as YourBrand Support, resolving GoHighLevel tickets fast while GHL Prime stays invisible">
        <div className="wsd-head">
          <div className="wsd-brand"><span className="wsd-avatar">Y</span><span className="wsd-brand-name">YourBrand Support</span></div>
          <div className="wsd-status"><span className="wsd-online" /> Online 3 agents active</div>
        </div>
        <div className="wsd-list">
          {WSD_TICKETS.map((t) => (
            <div className="wsd-ticket" key={t.id}>
              <span className="wsd-id">#{t.id}</span>
              <span className="wsd-subject">{t.subject}</span>
              <span className="wsd-type" style={{ background: WSD_TYPES[t.type].bg, color: WSD_TYPES[t.type].color }}>{t.type}</span>
              <span className={`wsd-pill ${t.state}`}>
                {t.state === 'resolved' ? <Check size={12} /> : <span className="pd" />}{t.status}
              </span>
              <span className="wsd-time">{t.time}</span>
            </div>
          ))}
        </div>
        <div className="wsd-stats">
          <span>Avg response: 47 min</span><span>Resolved today: 23</span><span>CSAT: 98%</span><span>Agents: 3 online</span>
        </div>
      </div>
      <p className="wsd-annot">↑ Your clients see your brand name here never GHL Prime</p>
    </div>
  )
}

function WhatIsVisual({ visual }) {
  if (!visual) return null
  // CodeCard brings its own float + tilt; the rest are plain mockups, so they
  // get the same treatment here rather than each re-implementing it.
  if (visual.kind === 'code' || !visual.kind) {
    return <CodeCard filename={visual.filename} code={visual.code} />
  }
  const inner =
    visual.kind === 'figma' ? <FigmaSplit />
    : visual.kind === 'helpdesk' ? <HelpdeskCard data={visual} />
    : visual.kind === 'workflow' ? <WorkflowBuilder />
    : visual.kind === 'dashboard' ? <CrmDashboard />
    : visual.kind === 'support' ? <SupportDesk />
    : <CodeCard filename={visual.filename} code={visual.code} />
  return (
    <div className="m3d-float">
      <Tilt className="svc-visual-3d" max={5}>{inner}</Tilt>
    </div>
  )
}

function Flow({ flow }) {
  return (
    <section className={`svc-section ${flow.alt === false ? '' : 'alt'}`.trim()}>
      <div className="container">
        <div className="svc-head center">
          {flow.eyebrow ? <span className="svc-eyebrow">{flow.eyebrow}</span> : null}
          <h2>{flow.h2}</h2>
        </div>
        <div className="svc-flow">
          {flow.steps.map((step, i) => (
            <FlowItem key={step.title} step={step} index={i} numbered={flow.numbered} last={i === flow.steps.length - 1} />
          ))}
        </div>
        {flow.note ? <p className="svc-flow-note">{rich(flow.note)}</p> : null}
      </div>
    </section>
  )
}

function FlowItem({ step, index, numbered, last }) {
  return (
    <>
      <motion.div
        className="svc-flow-step"
        style={{ transformOrigin: 'top center', transformPerspective: 1000 }}
        initial={{ opacity: 0, rotateX: -46, y: 22 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        whileHover={{ z: 24, transition: { type: 'spring', stiffness: 240, damping: 20 } }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: index * 0.1 }}
      >
        {numbered
          ? <span className="svc-flow-num">{index + 1}</span>
          : <span className={`ic svc-flow-icon ${tone(index)}`}><Icon name={step.icon} size={20} /></span>}
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </motion.div>
      {!last ? <span className="svc-flow-arrow" aria-hidden="true"><ArrowRight size={22} /></span> : null}
    </>
  )
}

function Deliverables({ deliver }) {
  const [tab, setTab] = useState(deliver.tabs ? deliver.tabs[0] : null)
  const cards = deliver.tabs ? deliver.cards.filter((c) => !c.tab || c.tab === tab) : deliver.cards
  return (
    <section className="svc-section alt">
      <div className="container">
        <div className="svc-head">
          <span className="svc-eyebrow">What is included</span>
          <h2>{deliver.h2}</h2>
        </div>
        {deliver.tabs ? (
          <div className="svc-tabs" role="tablist">
            {deliver.tabs.map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t}
                className={`svc-tab ${tab === t ? 'is-active' : ''}`.trim()} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
        ) : null}
        {/* key on the active tab so switching tabs replays the reveal on the
            cards that just swapped in, instead of showing them flat. */}
        <div className="svc-grid" key={tab || 'all'}>
          {cards.map((card, i) => (
            <TiltCard className="svc-card" key={card.title} reveal={cardReveal(i, 3)}>
              <span className={`ic svc-card-icon ${tone(i)}`}><Icon name={card.icon} size={20} /></span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

const HERO_MOCKUPS = {
  setup: { Cmp: HeroSetupCard, variant: 'wide' },
  workflowLive: { Cmp: HeroWorkflowLive, variant: 'wide' },
  phone: { Cmp: HeroPhoneAgent, variant: 'phone' },
  clientPortal: { Cmp: HeroClientPortal, variant: 'wide' },
  figmaCode: { Cmp: HeroFigmaCode, variant: 'wide' },
  appTabs: { Cmp: HeroAppTabs, variant: 'apptabs' },
}

function HeroMockup({ name }) {
  const entry = HERO_MOCKUPS[name]
  if (!entry) return null
  const { Cmp, variant } = entry
  return (
    <div className={`hero-mockup hero-mockup--${variant}`}>
      <div className="hero-mockup-in">
        <div className="hero-mockup-float"><Cmp /></div>
        {name === 'phone' ? (
          <div className="hero-mockup-pills">
            <span className="hero-mockup-pill"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> 24/7 availability</span>
            <span className="hero-mockup-pill"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> CRM updated automatically</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Hero3DCollageSection({ images }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  return (
    <section className="svc-section" style={{ padding: '6rem 0 12rem 0', position: 'relative', zIndex: 20 }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="svc-head center" style={{ zIndex: 10, position: 'relative', marginBottom: '2rem' }}>
          <h2>The Ultimate Operating System</h2>
          <p className="svc-hero-sub">A fully integrated ecosystem built for scaling your agency.</p>
        </div>
        
        <div 
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            aspectRatio: '16 / 9',
            perspective: '2000px',
            marginTop: '3rem',
            marginBottom: '4rem'
          }}
        >
          {images.map((src, i) => {
            const isHovered = hoveredIdx === i
            return (
            <motion.div
              key={src}
              initial={{ opacity: 0, z: -200, y: 100 }}
              whileInView={{ opacity: 1, z: i * 60, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.15 }}
              viewport={{ once: true, amount: 0.3 }}
              animate={isHovered ? {
                top: '30%',
                left: '50%',
                x: '-50%',
                y: '-30%',
                z: 600,
                scale: 1.35,
                rotateX: 0,
                rotateZ: 0,
                transition: { duration: 0.4, ease: "easeOut" }
              } : {
                top: `${i * 12}%`,
                left: `${i * 12}%`,
                x: '0%',
                y: '0%',
                z: i * 60,
                scale: 1,
                rotateX: 45,
                rotateZ: -20,
                transition: { type: 'spring', stiffness: 100, damping: 20 }
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position: 'absolute',
                width: '65%',
                borderRadius: '16px',
                boxShadow: isHovered 
                  ? '0 80px 140px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(0,0,0,0.05)'
                  : '-30px 30px 60px rgba(0,0,0,0.25), -10px 10px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.05)',
                background: '#fff',
                overflow: 'hidden',
                zIndex: isHovered ? 100 : i,
                cursor: 'pointer'
              }}
            >
              <img src={src} alt={`Dashboard ${i+1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  )
}

export default function ServiceDetailTemplate({ config }) {
  const formConfig = SERVICE_FORMS[config.slug]
  const url = `${SITE}${config.slug}`
  const showcasePageKey = pageKeyForServiceSlug(config.slug)
  // Prefer a per-service 1200x630 card, then the services hub card. The logo
  // was the old fallback and renders poorly as a social card (wrong aspect ratio).
  const serviceSlug = config.slug.replace('/services/', '')
  const ogImage = config.seo.ogImage || `${SITE}/og-services-${serviceSlug}.png`

  const organizationSchema = {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'GHL Prime', url: SITE,
    logo: `${SITE}/ghl-prime-logo.png`,
    contactPoint: { '@type': 'ContactPoint', telephone: '+1-505-207-5189', contactType: 'customer service' },
    address: { '@type': 'PostalAddress', streetAddress: '4801 Lang Ave NE, Suite 110', addressLocality: 'Albuquerque', addressRegion: 'NM', postalCode: '87109', addressCountry: 'US' },
    sameAs: ['https://www.linkedin.com/company/ghl-prime-llc', 'https://www.upwork.com/agencies/ghlprime/'],
  }
  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'Service', name: config.serviceSchema.name,
    description: config.serviceSchema.description,
    provider: { '@type': 'Organization', name: 'GHL Prime', url: SITE },
    areaServed: ['US', 'CA', 'GB', 'AU'], serviceType: config.serviceSchema.serviceType,
  }
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: config.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services` },
      { '@type': 'ListItem', position: 3, name: config.category, item: `${SITE}/services` },
      { '@type': 'ListItem', position: 4, name: config.breadcrumbName, item: url },
    ],
  }
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo', name: config.how.h2,
    step: config.how.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text })),
  }

  return (
    <main className="svc-page" id="main-content">
      {/* title/description/keywords/robots/canonical/og:* and twitter:* now come
          from each service route's page.tsx metadata export, built by
          app/_lib/serviceMetadata.ts from this same `config` object. The 5
          JSON-LD scripts stay here, computed exactly as before. html lang is
          set once, statically, in the root layout -- no per-page equivalent
          needed. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      {/* Hero */}
      <section className="svc-hero">
        <div className="container">
          <nav className="svc-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><ChevronRight size={13} aria-hidden="true" />
            <Link href="/services">Services</Link><ChevronRight size={13} aria-hidden="true" />
            <span>{config.category}</span><ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">{config.breadcrumbName}</span>
          </nav>
          {formConfig ? (
            <div className="svc-hero-2col">
              <motion.div
                className="svc-hero-inner svc-hero-inner--left"
                variants={heroStack}
                initial="hidden"
                animate="show"
              >
                <motion.span className="svc-eyebrow-pill" {...heroLineProps}>
                  <span className="svc-eyebrow-pill-text">{config.hero.eyebrow}</span>
                </motion.span>
                <motion.h1 {...heroLineProps}>{config.hero.h1}</motion.h1>
                <motion.p className="svc-hero-sub" {...heroLineProps}>{formConfig.heroSubhead || config.hero.subhead}</motion.p>
                <HeroBadges badges={config.hero.badges} />
                <motion.a
                  className="primary-pill svc-hero-upwork"
                  href={UPWORK}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...heroLineProps}
                >
                  Or hire via Upwork &rarr;
                </motion.a>
              </motion.div>
              {/* The card swings in from its right edge. No pointer tilt on
                  this one: it is a form, and a panel that moves under the
                  cursor while you are typing into it is hostile. */}
              <motion.div
                className="svc-hero-form-col"
                style={{ transformOrigin: 'right center', transformPerspective: 1300 }}
                initial={{ opacity: 0, rotateY: 20, x: 34 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: 0.12 }}
              >
                <ServiceSurveyForm form={formConfig} slug={config.slug} />
              </motion.div>
            </div>
          ) : (
            <>
              <motion.div className="svc-hero-inner" variants={heroStack} initial="hidden" animate="show">
                <motion.span className="svc-eyebrow-pill" {...heroLineProps}>
                  <span className="svc-eyebrow-pill-text">{config.hero.eyebrow}</span>
                </motion.span>
                <motion.h1 {...heroLineProps}>{config.hero.h1}</motion.h1>
                <motion.p className="svc-hero-sub" {...heroLineProps}>{config.hero.subhead}</motion.p>
                <div className="svc-hero-ctas">
                  <Link href={config.hero.ctaPrimary.to} className="primary-pill large">{config.hero.ctaPrimary.label} <ArrowRight size={18} /></Link>
                  <Link href={config.hero.ctaSecondary.to} className="secondary-pill">{config.hero.ctaSecondary.label}</Link>
                </div>
                <HeroBadges badges={config.hero.badges} />
              </motion.div>
              {config.hero.mockup ? <HeroMockup name={config.hero.mockup} /> : null}
            </>
          )}
        </div>
      </section>

      {/* 3D Showcase Section */}
      {config.showcase3D ? <Hero3DCollageSection images={config.showcase3D.images} /> : null}

      {/* Stats bar */}
      <section className="svc-section" style={{ paddingTop: '3rem', paddingBottom: '0' }}>
        <div className="container">
          <div className="svc-stats">
            {config.stats.map((s, i) => (
              <motion.div
                className="svc-stat"
                key={s.label}
                style={{ transformOrigin: 'bottom center', transformPerspective: 900 }}
                initial={{ opacity: 0, rotateX: -55 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                whileHover={{ z: 28, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: 'spring', stiffness: 90, damping: 16, mass: 0.9, delay: i * 0.08 }}
              >
                <span className="svc-stat-num">{s.num}</span>
                <span className="svc-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional flow right after the stats (white-label support) */}
      {config.flowAfterStats ? <Flow flow={config.flowAfterStats} /> : null}

      {/* What is it */}
      <section className="svc-section">
        <div className="container">
          <div className="svc-highlight">
            <div className="svc-highlight-text">
              <span className="svc-eyebrow">{config.whatIs.eyebrow || 'Overview'}</span>
              <h2>{config.whatIs.h2}</h2>
              <div className="svc-prose">
                {config.whatIs.paragraphs.map((p, i) => <p key={i}>{rich(p)}</p>)}
              </div>
              {config.whatIs.cta ? (
                <Link href={config.whatIs.cta.to} className="primary-pill large" style={{ marginTop: '.4rem' }}>
                  {config.whatIs.cta.label} <ArrowRight size={18} />
                </Link>
              ) : null}
            </div>
            <motion.div {...fade} transition={{ duration: 0.55, delay: 0.1 }}>
              <WhatIsVisual visual={config.whatIs.visual} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <Deliverables deliver={config.deliver} />

      {/* Optional callout (custom SaaS security) */}
      {config.callout ? (
        <section className="svc-section">
          <div className="container">
            <div className="svc-callout">
              <span className="ic svc-callout-icon ic-indigo"><Icon name={config.callout.icon} size={22} /></span>
              <div>
                <h3>{config.callout.title}</h3>
                <p>{config.callout.text}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Optional flow after deliverables (AI agent journey) */}
      {config.flowAfterDeliver ? <Flow flow={config.flowAfterDeliver} /> : null}

      {/* How it works */}
      <section className="svc-section alt">
        <div className="container">
          <div className="svc-head">
            <span className="svc-eyebrow">The process</span>
            <h2>{config.how.h2}</h2>
          </div>
          <ProcessSteps steps={config.how.steps} />
        </div>
      </section>

      {/* Optional phases (custom SaaS) */}
      {config.phases ? (
        <section className="svc-section">
          <div className="container">
            <div className="svc-head">
              <span className="svc-eyebrow">Delivery model</span>
              <h2>{config.phases.h2}</h2>
            </div>
            <div className="svc-phases">
              {config.phases.items.map((p, i) => (
                <motion.div
                  className="svc-phase"
                  key={p.name}
                  style={{ transformOrigin: 'left center', transformPerspective: 1100 }}
                  initial={{ opacity: 0, rotateY: -22, x: 24 }}
                  whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay: (i % 7) * 0.06 }}
                >
                  <span className={`svc-phase-dot ${p.group}`} />
                  <span className="svc-phase-n">{String(i + 1).padStart(2, '0')}</span>
                  <div className="svc-phase-body">
                    <h3>{p.name}</h3>
                    <p>{p.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Who it's for */}
      <section className="svc-section">
        <div className="container">
          <div className="svc-head">
            <span className="svc-eyebrow">Who we work with</span>
            <h2>{config.who.h2}</h2>
          </div>
          <div className="svc-grid two">
            {config.who.cards.map((card, i) => (
              <TiltCard className="svc-card" key={card.title} reveal={cardReveal(i, 2)}>
                <span className={`ic svc-card-icon ${tone(i)}`}><Icon name={card.icon} size={20} /></span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {config.techStack ? (
        <section className="svc-section">
          <div className="container">
            <div className="svc-head">
              <span className="svc-eyebrow">{config.techStack.eyebrow || 'Technology'}</span>
              <h2>{config.techStack.h2}</h2>
            </div>
            <div className="svc-tech-grid">
              {config.techStack.items.map((t) => (
                <div className="svc-tech-cell" key={t.name}>
                  <span className="svc-tech-mono" style={{ background: t.color }}>{t.abbr}</span>
                  <span className="svc-tech-name">{t.name}</span>
                </div>
              ))}
            </div>
            {config.techStack.note ? <div className="svc-prose" style={{ marginTop: '1.5rem' }}><p>{rich(config.techStack.note)}</p></div> : null}
          </div>
        </section>
      ) : null}

      {/* Why GHL Prime */}
      <section className="svc-section alt">
        <div className="container">
          <div className="svc-head">
            <span className="svc-eyebrow">Why GHL Prime</span>
            <h2>{config.why.h2}</h2>
            {config.why.intro ? <div className="svc-prose"><p>{rich(config.why.intro)}</p></div> : null}
          </div>
          {config.why.points ? (
            <div className="svc-why-panel">
              <motion.div className="svc-why-list" {...groupProps}>
                {config.why.points.map((point) => (
                  <motion.div
                    className="svc-why-row"
                    key={point}
                    variants={revealItem}
                    style={{ transformOrigin: 'top center', transformPerspective: 900 }}
                    whileHover={{ z: 18, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
                  >
                    <span className="svc-why-check" aria-hidden="true"><CheckCircle2 size={18} /></span>
                    <span>{point}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : null}
          {config.why.comparison ? (
            <div className="svc-compare-wrap">
              <table className="svc-compare">
                <thead>
                  <tr>
                    <th />
                    {config.why.comparison.columns.map((col) => (
                      <th key={col} className={col === 'GHL Prime' ? 'is-prime' : ''}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {config.why.comparison.rows.map((row) => (
                    <tr key={row.feature}>
                      <td className="svc-compare-feat">{row.feature}</td>
                      {row.vals.map((v, i) => (
                        <td key={i} className={config.why.comparison.columns[i] === 'GHL Prime' ? 'is-prime' : ''}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {config.why.callouts ? (
            <div className="svc-callout-grid">
              {config.why.callouts.map((co) => (
                <div className="svc-callout" key={co.title}>
                  <span className="ic svc-callout-icon ic-indigo"><Icon name={co.icon || 'ShieldCheck'} size={22} /></span>
                  <div><h3>{co.title}</h3><p>{co.text}</p></div>
                </div>
              ))}
            </div>
          ) : null}
          {config.why.pricing ? (
            <div className="svc-pricing">
              {config.why.pricing.map((p) => (
                <div className={`svc-price-card ${p.popular ? 'popular' : ''}`.trim()} key={p.name}>
                  {p.popular ? <span className="svc-popular">Popular</span> : null}
                  <span className="svc-price-name">{p.name}</span>
                  <p className="svc-price-desc">{p.desc}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* FAQ (shared site component) */}
      <FaqSection eyebrow="FAQ" title="Frequently Asked Questions" intro={config.faqIntro} faqs={config.faqs} />
      <ShippedEvidenceSection pageKey={showcasePageKey} />

      {/* CTA closer */}
      <section className="svc-cta">
        <div className="container">
          <motion.div
            style={{ transformOrigin: 'bottom center', transformPerspective: 1200 }}
            initial={{ opacity: 0, rotateX: 26, y: 30 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }}
          >
            <h2>{config.cta.headline}</h2>
            <p>{config.cta.subtext}</p>
            <div className="svc-cta-actions">
              <Link href="/booking" className="primary-pill large">{config.cta.primaryLabel} <ArrowRight size={18} /></Link>
              <a href={UPWORK} target="_blank" rel="noopener noreferrer" className="svc-cta-ghost">Hire via Upwork</a>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
