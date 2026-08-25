'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
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
  Voicemail,
} from 'lucide-react'
import './home-v2.css'

// A real, causally-sound automation, not a placeholder: everything a
// condition checks is something the system could actually know at that
// point. The trigger fires the moment a lead comes in, so the first branch
// is "what time is it right now" (business hours / after hours / weekend),
// something knowable instantly -- not a reply that has not happened yet.
// Only the business-hours branch calls right away, and only THAT call
// produces something worth branching on again (did it connect). The other
// two branches queue the lead for later instead of inventing a response.
//
// Two coordinate sets, not one: on a laptop/desktop the flow reads left to
// right (the middle branch level with the trigger, the other two peeling off
// above and below). On a phone that same shape reads top to bottom instead
// (the middle branch straight down the centre, the others left and right) --
// a wide left-to-right diagram does not compress onto a phone screen without
// either a scrollbar or illegibly small text, and both were tried and
// rejected. Node content (titles, icons, delays) is identical between the
// two; only the x/y layout differs.

const HORIZONTAL_NODES = [
  { id: 'trigger', kind: 'trigger', tone: 'ic-sky', icon: UserRoundPlus, title: 'New Lead Captured', sub: 'form submitted', x: 70, y: 300, delay: 0 },
  { id: 'condition1', kind: 'condition', tone: 'ic-indigo', icon: GitBranch, title: 'Business Hours?', sub: 'condition', x: 290, y: 300, delay: 0.3 },

  { id: 'email', kind: 'action', tone: 'ic-violet', icon: PhoneCall, title: 'Call the Lead', sub: 'business hours', x: 500, y: 110, delay: 0.62 },
  { id: 'condition2', kind: 'condition', tone: 'ic-indigo', icon: CalendarCheck, title: 'Call Answered?', sub: 'condition', x: 710, y: 110, delay: 0.94 },
  { id: 'won', kind: 'action', tone: 'ic-teal', icon: CalendarPlus, title: 'Book Discovery Call', sub: 'yes', x: 930, y: 40, delay: 1.26 },
  { id: 'end-closed', kind: 'end', tone: 'ic-emerald', icon: Trophy, title: 'Meeting Scheduled', sub: 'end', x: 1140, y: 40, delay: 1.58 },
  { id: 'reminder', kind: 'action', tone: 'ic-amber', icon: Voicemail, title: 'Leave Voicemail', sub: 'no answer', x: 930, y: 180, delay: 1.26 },
  { id: 'end-nurture-a', kind: 'end', tone: 'ic-emerald', icon: Layers, title: 'Added to Call Queue', sub: 'end', x: 1140, y: 180, delay: 1.58 },

  { id: 'sms', kind: 'action', tone: 'ic-amber', icon: MessageSquareText, title: 'After-Hours Text', sub: 'auto-sent', x: 500, y: 300, delay: 0.62 },
  { id: 'tag', kind: 'action', tone: 'ic-blue', icon: Tag, title: 'Add Follow-Up Tag', sub: 'next-day', x: 710, y: 300, delay: 0.94 },
  { id: 'end-nurture-b', kind: 'end', tone: 'ic-emerald', icon: Repeat, title: 'Queued for Morning', sub: 'end', x: 930, y: 300, delay: 1.26 },

  { id: 'notinterested', kind: 'action', tone: 'ic-rose', icon: Mail, title: 'Weekend Auto-Reply', sub: 'weekend', x: 500, y: 490, delay: 0.62 },
  { id: 'wait', kind: 'action', tone: 'ic-rose', icon: Clock, title: 'Wait Until Monday', sub: 'scheduled', x: 710, y: 490, delay: 0.94 },
  { id: 'end-archived', kind: 'end', tone: 'ic-emerald', icon: CalendarClock, title: 'Follow-Up Monday AM', sub: 'end', x: 930, y: 490, delay: 1.26 },
]

const HORIZONTAL_PATHS = [
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

// Same 14 nodes, same 13 wires, laid out top-to-bottom instead of left-to-
// right: the middle branch runs straight down the centre from the trigger,
// "interested" fans out to two lanes on the left, "no response" to one lane
// on the right.
const VERTICAL_NODES = [
  { id: 'trigger', kind: 'trigger', tone: 'ic-sky', icon: UserRoundPlus, title: 'New Lead Captured', sub: 'form submitted', x: 430, y: 60, delay: 0 },
  { id: 'condition1', kind: 'condition', tone: 'ic-indigo', icon: GitBranch, title: 'Business Hours?', sub: 'condition', x: 430, y: 260, delay: 0.3 },

  { id: 'email', kind: 'action', tone: 'ic-violet', icon: PhoneCall, title: 'Call the Lead', sub: 'business hours', x: 210, y: 460, delay: 0.62 },
  { id: 'condition2', kind: 'condition', tone: 'ic-indigo', icon: CalendarCheck, title: 'Call Answered?', sub: 'condition', x: 210, y: 660, delay: 0.94 },
  { id: 'won', kind: 'action', tone: 'ic-teal', icon: CalendarPlus, title: 'Book Discovery Call', sub: 'yes', x: 100, y: 860, delay: 1.26 },
  { id: 'end-closed', kind: 'end', tone: 'ic-emerald', icon: Trophy, title: 'Meeting Scheduled', sub: 'end', x: 100, y: 1060, delay: 1.58 },
  { id: 'reminder', kind: 'action', tone: 'ic-amber', icon: Voicemail, title: 'Leave Voicemail', sub: 'no answer', x: 320, y: 860, delay: 1.26 },
  { id: 'end-nurture-a', kind: 'end', tone: 'ic-emerald', icon: Layers, title: 'Added to Call Queue', sub: 'end', x: 320, y: 1060, delay: 1.58 },

  { id: 'sms', kind: 'action', tone: 'ic-amber', icon: MessageSquareText, title: 'After-Hours Text', sub: 'auto-sent', x: 540, y: 460, delay: 0.62 },
  { id: 'tag', kind: 'action', tone: 'ic-blue', icon: Tag, title: 'Add Follow-Up Tag', sub: 'next-day', x: 540, y: 660, delay: 0.94 },
  { id: 'end-nurture-b', kind: 'end', tone: 'ic-emerald', icon: Repeat, title: 'Queued for Morning', sub: 'end', x: 540, y: 860, delay: 1.26 },

  { id: 'notinterested', kind: 'action', tone: 'ic-rose', icon: Mail, title: 'Weekend Auto-Reply', sub: 'weekend', x: 760, y: 460, delay: 0.62 },
  { id: 'wait', kind: 'action', tone: 'ic-rose', icon: Clock, title: 'Wait Until Monday', sub: 'scheduled', x: 760, y: 660, delay: 0.94 },
  { id: 'end-archived', kind: 'end', tone: 'ic-emerald', icon: CalendarClock, title: 'Follow-Up Monday AM', sub: 'end', x: 760, y: 860, delay: 1.26 },
]

const VERTICAL_PATHS = [
  { id: 'l-trigger', d: 'M430,60 L430,260', delay: 0.16 },

  { id: 'l-a-in', d: 'M430,260 C 430,360 210,360 210,460', delay: 0.46 },
  { id: 'l-b-in', d: 'M430,260 C 430,360 540,360 540,460', delay: 0.46 },
  { id: 'l-c-in', d: 'M430,260 C 430,360 760,360 760,460', delay: 0.46 },

  { id: 'l-a1', d: 'M210,460 L210,660', delay: 0.78 },
  { id: 'l-b1', d: 'M540,460 L540,660', delay: 0.78 },
  { id: 'l-c1', d: 'M760,460 L760,660', delay: 0.78 },

  { id: 'l-a2-yes', d: 'M210,660 C 210,760 100,760 100,860', delay: 1.1 },
  { id: 'l-a2-no', d: 'M210,660 C 210,760 320,760 320,860', delay: 1.1 },
  { id: 'l-b2', d: 'M540,660 L540,860', delay: 1.1 },
  { id: 'l-c2', d: 'M760,660 L760,860', delay: 1.1 },

  { id: 'l-a3-yes', d: 'M100,860 L100,1060', delay: 1.42 },
  { id: 'l-a3-no', d: 'M320,860 L320,1060', delay: 1.42 },
]

const SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 }

// Each layout is authored in a 0..DIAGRAM_W by 0..DIAGRAM_H space with no
// margin -- the outermost nodes sit right at the edge, and since a node's
// own width/height extends past its centre point, drawn at those exact
// coordinates the outermost cards would bleed off the edge of the canvas.
// Rather than rework every coordinate, the canvas is padded: CANVAS_W/H add
// a margin on each side, and the SVG viewBox is shifted into negative
// territory by that same margin so the original path coordinates land
// inset, with room for every node's half-width and half-height to spare.
const LAYOUTS = {
  horizontal: {
    nodes: HORIZONTAL_NODES,
    paths: HORIZONTAL_PATHS,
    // Asymmetric on purpose: the trigger (x=70) sits 70 units in from the
    // diagram's own left edge, but the rightmost nodes (x=1140) sit 80 units
    // in from its right edge (diagramW=1220) -- a 10-unit imbalance baked
    // into the coordinates themselves. A single margin added equally to both
    // sides carries that imbalance straight through to the rendered canvas,
    // leaving visibly more empty space on the right than the left. Giving
    // the left 10 more units than the right cancels it out.
    marginLeft: 110,
    marginRight: 100,
    marginY: 45,
    diagramW: 1220,
    diagramH: 560,
  },
  vertical: {
    nodes: VERTICAL_NODES,
    paths: VERTICAL_PATHS,
    // Symmetric: the vertical coordinates are already centred left/right
    // (trigger and the centre lane both sit at x=430, exactly mid-way
    // between the x=100 and x=760 lanes), so one shared margin keeps that
    // symmetry intact instead of introducing a new imbalance.
    marginLeft: 105,
    marginRight: 105,
    marginY: 100,
    diagramW: 860,
    diagramH: 1060,
  },
}

// Matches the site's existing mobile breakpoint (see the @media rules at the
// bottom of home-v2.css) so this switches layout at the same point every
// other section reflows at.
const MOBILE_QUERY = '(max-width: 760px)'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return isMobile
}

// Nodes and wires share the one `active` flag from the section's own
// useInView below, rather than each tracking its own viewport visibility --
// two independent triggers can fire at different scroll positions, which
// desyncs a wire from the two nodes it is supposed to connect.
// Centering lives on this plain (non-framer) anchor, not on the motion.div
// below. A motion.div that animates any transform-related value (z and
// scale here) writes its OWN inline `transform` and fully replaces
// whatever a CSS class declared for that property -- so a single element
// trying to both centre itself via translate(-50%, -50%) in CSS and animate
// via framer never actually centres: framer's inline transform wins outright,
// and every node ends up positioned by its left EDGE instead of its centre,
// silently shifted right by half its own width. Splitting the two onto
// separate elements is the fix (same issue, same fix, as the scale/float
// split elsewhere in this file's history).
function WfNode({ node, active, marginLeft, marginY, canvasW, canvasH }) {
  const Icon = node.icon
  return (
    <div
      className="hv2-wf-node-anchor"
      style={{ left: `${((node.x + marginLeft) / canvasW) * 100}%`, top: `${((node.y + marginY) / canvasH) * 100}%` }}
    >
      <motion.div
        className={`hv2-wf-node kind-${node.kind}`}
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
    </div>
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
  const isMobile = useIsMobile()

  const layout = isMobile ? LAYOUTS.vertical : LAYOUTS.horizontal
  const canvasW = layout.diagramW + layout.marginLeft + layout.marginRight
  const canvasH = layout.diagramH + layout.marginY * 2

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
          <h2>One Lead. Three Branches. <span className="hv2-hl">Every Path Ends Somewhere.</span></h2>
          <p>
            This is the same node-and-branch logic running behind every account we build, triggers,
            conditions, and actions wired together so a lead is never waiting on a human to move it forward.
          </p>
        </motion.div>

        {/* No card, no border, no backdrop -- the diagram sits directly on
            the page. container-type below is what lets every node's size
            (not just its position) shrink or grow in lockstep with the
            canvas, so the whole thing is always visible at once with
            nothing ever scrolled or clipped out of view. */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={SPRING}
        >
          <div
            className={`hv2-wf-canvas ${isMobile ? 'is-vertical' : 'is-horizontal'}`}
            role="img"
            aria-label="An automation workflow: a new lead is captured, then routed by whether it is currently business hours. During business hours the lead is called immediately, then branches again on whether the call was answered, ending in either a scheduled discovery call or the lead being added to a call queue with a voicemail left. Outside business hours the lead gets an after-hours text, is tagged for next-day follow-up, and is queued for the morning. On a weekend the lead gets an automatic reply and is queued to be followed up with Monday morning."
          >
            <svg
              className="hv2-wf-svg"
              viewBox={`-${layout.marginLeft} -${layout.marginY} ${canvasW} ${canvasH}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {layout.paths.map((path) => (
                <WfWire key={path.id} path={path} active={active} />
              ))}
              {/* A pulse travels each wire once it has finished drawing, so the
                  canvas keeps reading as a live system rather than a still
                  diagram. SMIL animateMotion rather than a CSS offset-path:
                  the same technique ProcessV2 and the About page marks
                  already use, with far more consistent browser support than
                  CSS motion-path animation. */}
              {!reduceMotion && active ? layout.paths.map((path) => (
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
            {layout.nodes.map((node) => (
              <WfNode
                key={node.id}
                node={node}
                active={active}
                marginLeft={layout.marginLeft}
                marginY={layout.marginY}
                canvasW={canvasW}
                canvasH={canvasH}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
