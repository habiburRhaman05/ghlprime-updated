'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  Archive,
  BellRing,
  CalendarCheck,
  Clock,
  GitBranch,
  Layers,
  Mail,
  MessageSquareText,
  PhoneCall,
  Repeat,
  Tag,
  Trophy,
  UserRoundPlus,
  UserRoundX,
} from 'lucide-react'
import Tilt from '../motion3d/Tilt'
import './home-v2.css'

// A single automation drawing itself in real time -- a trigger, a three-way
// branch, one of those branches splitting again one level deeper, and every
// path landing on its own explicit end rather than all quietly merging into
// one. The same shape as the workflow builders inside GoHighLevel: the
// middle branch runs level with the trigger, the other two peel off above
// and below it, and "interested" branches again once a call is attempted.
const NODES = [
  { id: 'trigger', kind: 'trigger', tone: 'ic-sky', icon: UserRoundPlus, title: 'New Lead Captured', sub: 'form submitted', x: 70, y: 300, delay: 0 },
  { id: 'condition1', kind: 'condition', tone: 'ic-indigo', icon: GitBranch, title: 'Response Type', sub: 'condition', x: 290, y: 300, delay: 0.3 },

  // Branch A -- interested (top row), with its own sub-branch after the call.
  { id: 'email', kind: 'action', tone: 'ic-violet', icon: Mail, title: 'Send Welcome Email', sub: 'interested', x: 500, y: 110, delay: 0.62 },
  { id: 'condition2', kind: 'condition', tone: 'ic-indigo', icon: CalendarCheck, title: 'Call Answered?', sub: 'condition', x: 710, y: 110, delay: 0.94 },
  { id: 'won', kind: 'action', tone: 'ic-teal', icon: PhoneCall, title: 'Call Confirmed', sub: 'yes', x: 930, y: 40, delay: 1.26 },
  { id: 'end-closed', kind: 'end', tone: 'ic-emerald', icon: Trophy, title: 'Deal Closed', sub: 'end', x: 1140, y: 40, delay: 1.58 },
  { id: 'reminder', kind: 'action', tone: 'ic-amber', icon: BellRing, title: 'Send Call Reminder', sub: 'no answer', x: 930, y: 180, delay: 1.26 },
  { id: 'end-nurture-a', kind: 'end', tone: 'ic-emerald', icon: Layers, title: 'Added to Nurture', sub: 'end', x: 1140, y: 180, delay: 1.58 },

  // Branch B -- some interest (middle row, level with the trigger).
  { id: 'sms', kind: 'action', tone: 'ic-amber', icon: MessageSquareText, title: 'Send Follow-Up SMS', sub: 'some interest', x: 500, y: 300, delay: 0.62 },
  { id: 'tag', kind: 'action', tone: 'ic-blue', icon: Tag, title: 'Add Nurture Tag', sub: 'ongoing sequence', x: 710, y: 300, delay: 0.94 },
  { id: 'end-nurture-b', kind: 'end', tone: 'ic-emerald', icon: Repeat, title: 'In Nurture Sequence', sub: 'end', x: 930, y: 300, delay: 1.26 },

  // Branch C -- no response (bottom row).
  { id: 'notinterested', kind: 'action', tone: 'ic-rose', icon: UserRoundX, title: 'Mark Not Interested', sub: 'no response', x: 500, y: 490, delay: 0.62 },
  { id: 'wait', kind: 'action', tone: 'ic-rose', icon: Clock, title: 'Wait 30 Days', sub: 'then re-check', x: 710, y: 490, delay: 0.94 },
  { id: 'end-archived', kind: 'end', tone: 'ic-emerald', icon: Archive, title: 'Archived', sub: 'end', x: 930, y: 490, delay: 1.26 },
]

// Every wire is drawn between node CENTRES rather than trimmed to node
// edges -- the opaque node card sits above the wire in paint order (it is
// rendered after the <svg>, on the same 3D layer) and simply covers the
// segment that runs underneath it, which needs no per-node edge geometry.
const PATHS = [
  { id: 'l-trigger', d: 'M70,300 L290,300', delay: 0.16 },

  { id: 'l-a-in', d: 'M290,300 C 390,300 390,110 500,110', delay: 0.46 },
  { id: 'l-b-in', d: 'M290,300 L500,300', delay: 0.46 },
  { id: 'l-c-in', d: 'M290,300 C 390,300 390,490 500,490', delay: 0.46 },

  { id: 'l-a1', d: 'M500,110 L710,110', delay: 0.78 },
  { id: 'l-b1', d: 'M500,300 L710,300', delay: 0.78 },
  { id: 'l-c1', d: 'M500,490 L710,490', delay: 0.78 },

  { id: 'l-a2-yes', d: 'M710,110 C 810,110 810,40 930,40', delay: 1.1 },
  { id: 'l-a2-no', d: 'M710,110 C 810,110 810,180 930,180', delay: 1.1 },
  { id: 'l-b2', d: 'M710,300 L930,300', delay: 1.1 },
  { id: 'l-c2', d: 'M710,490 L930,490', delay: 1.1 },

  { id: 'l-a3-yes', d: 'M930,40 L1140,40', delay: 1.42 },
  { id: 'l-a3-no', d: 'M930,180 L1140,180', delay: 1.42 },
]

const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }

// The diagram itself (NODES/PATHS above) is authored in a 0..DIAGRAM_W by
// 0..DIAGRAM_H space with no margin -- the outermost nodes sit right at x=0
// or x=DIAGRAM_W. A node's own width means its edge extends past its centre
// point, so drawn at those exact coordinates the leftmost and rightmost
// cards bleed off the edge of the canvas. Rather than rework every
// coordinate, the canvas is simply padded: CANVAS_W/H add a margin on each
// side, and the SVG viewBox is shifted into negative territory by that same
// margin so the original path coordinates land inset, with room for every
// node's half-width and half-height to spare.
const DIAGRAM_W = 1220
const DIAGRAM_H = 560
const MARGIN_X = 100
const MARGIN_Y = 45
const CANVAS_W = DIAGRAM_W + MARGIN_X * 2
const CANVAS_H = DIAGRAM_H + MARGIN_Y * 2

// Nodes and wires share the one `active` flag from the section's own
// useInView below, rather than each tracking its own viewport visibility --
// two independent triggers can fire at different scroll positions, which
// desyncs a wire from the two nodes it is supposed to connect.
function WfNode({ node, active }) {
  const Icon = node.icon
  return (
    <motion.div
      className={`hv2-wf-node kind-${node.kind}`}
      style={{ left: `${((node.x + MARGIN_X) / CANVAS_W) * 100}%`, top: `${((node.y + MARGIN_Y) / CANVAS_H) * 100}%` }}
      initial={{ opacity: 0, z: -160, scale: 0.85 }}
      animate={active ? { opacity: 1, z: 0, scale: 1 } : {}}
      transition={{ ...SPRING, delay: node.delay }}
    >
      <span className={`ic ic-solid ${node.tone}`}><Icon /></span>
      <span className="hv2-wf-node-body">
        <strong>{node.title}</strong>
        <em>{node.sub}</em>
      </span>
    </motion.div>
  )
}

function WfWire({ path, active }) {
  return (
    <motion.path
      d={path.d}
      className="hv2-wf-wire"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={active ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: path.delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

export default function WorkflowCanvasV2() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })
  const active = reduceMotion ? true : inView

  return (
    <section className="hv2 hv2-section is-white hv2-wf-section" ref={sectionRef}>
      <div className="hv2-inner">
        <motion.div
          className="hv2-head centered"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={SPRING}
        >
          <span className="hv2-eyebrow">How the builds actually work</span>
          <h2>One lead. Three branches. <span className="hv2-hl">Every path ends somewhere.</span></h2>
          <p>
            This is the same node-and-branch logic running behind every account we build, triggers,
            conditions, and actions wired together so a lead is never waiting on a human to move it forward.
          </p>
        </motion.div>

        {/* No card, no border, no backdrop -- the diagram sits directly on
            the page. container-type below is what lets every node's size
            (not just its position) shrink in lockstep with the canvas, so
            the whole thing is always visible at once with nothing ever
            scrolled or clipped out of view, on a phone or anywhere else. */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={SPRING}
        >
          <Tilt
            className="hv2-wf-canvas"
            max={4}
            role="img"
            aria-label="An automation workflow: a new lead is captured, then branches three ways by response type. Interested leads get a welcome email, then branch again on whether the follow-up call was answered, ending in either a closed deal or a nurture sequence. Leads who show some interest get a follow-up SMS and a nurture tag, ending in an ongoing nurture sequence. Leads with no response are marked not interested, wait 30 days, and end up archived."
          >
            <svg className="hv2-wf-svg" viewBox={`-${MARGIN_X} -${MARGIN_Y} ${CANVAS_W} ${CANVAS_H}`} preserveAspectRatio="none" aria-hidden="true">
              {PATHS.map((path) => (
                <WfWire key={path.id} path={path} active={active} />
              ))}
              {/* A pulse travels each wire once it has finished drawing, so the
                  canvas keeps reading as a live system rather than a still
                  diagram. SMIL animateMotion rather than a CSS offset-path:
                  the same technique ProcessV2 and the About page marks
                  already use, with far more consistent browser support than
                  CSS motion-path animation. */}
              {!reduceMotion && active ? PATHS.map((path) => (
                <circle key={`dot-${path.id}`} className="hv2-wf-pulse" r="4.5">
                  <animateMotion
                    dur="2.4s"
                    begin={`${path.delay + 0.6}s`}
                    repeatCount="indefinite"
                    path={path.d}
                  />
                </circle>
              )) : null}
            </svg>
            {NODES.map((node) => (
              <WfNode key={node.id} node={node} active={active} />
            ))}
          </Tilt>
        </motion.div>
      </div>
    </section>
  )
}
