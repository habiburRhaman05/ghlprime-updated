import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Quote } from 'lucide-react'
import './team-testimonials.css'

// TODO: placeholder copy + avatars. Swap for real team quotes and photos
// (the Admin > Team manager already stores headshots via src/lib/teamApi.js).
 const TESTIMONIALS = [
  {
    name: 'Abdullah All Meyad',
    role: 'AI & Automation Expert',
    avatar: 'https://picsum.photos/seed/ghlprime-tt1/240/280',
    segments: [
      { text: "I've built automation systems before, but " },
      { text: 'GHL Prime is where I finally get to push AI workflows to their full potential', highlight: true },
      { text: '. The team trusts me to experiment, ship fast, and actually see ' },
      { text: 'the impact on client accounts within days, not months', highlight: true },
      { text: '.' },
    ],
  },
  {
    name: 'Abdul Hamid',
    role: 'Sales Funnel & Web Developer',
    avatar: 'https://picsum.photos/seed/ghlprime-tt2/240/280',
    segments: [
      { text: 'Every funnel I build here has to actually convert, not just look good. ' },
      { text: 'What I love about GHL Prime is that the whole team obsesses over results the same way I do', highlight: true },
      { text: ', from the copy, to the code, to the final call to action. ' },
      { text: "That kind of alignment is rare on a dev team", highlight: true },
      { text: '.' },
    ],
  },
  {
    name: 'Andrea Bagtas',
    role: 'GoHighLevel Automation Expert & Project Manager',
    avatar: 'https://picsum.photos/seed/ghlprime-tt3/240/280',
    segments: [
      { text: 'Managing automation projects across multiple agencies used to mean constant firefighting. ' },
      { text: 'At GHL Prime our process is tight enough that I can actually plan ahead instead of just reacting', highlight: true },
      { text: ', and that changes everything for how clients experience us. ' },
      { text: 'Deadlines stopped feeling like a gamble', highlight: true },
      { text: '.' },
    ],
  },
  {
    name: 'Mahbubullah',
    role: 'Full-Stack Developer',
    avatar: 'https://picsum.photos/seed/ghlprime-tt4/240/280',
    segments: [
      { text: "I've worked on teams where design, backend, and automation live in separate silos. " },
      { text: 'GHL Prime is the first place I have seen those three actually talk to each other every day', highlight: true },
      { text: ', and it shows in how fast we ship. ' },
      { text: 'Nobody hands off half a solution and walks away', highlight: true },
      { text: '.' },
    ],
  },
  {
    name: 'Md. Rakibul Hasan',
    role: 'Workflow Automation Consultant',
    avatar: 'https://picsum.photos/seed/ghlprime-tt5/240/280',
    segments: [
      { text: 'Clients come to us with workflows held together with patchwork fixes. ' },
      { text: 'What GHL Prime taught me is that a good automation consultant does not just fix what is broken', highlight: true },
      { text: ', they rebuild the system so ' },
      { text: 'it never breaks the same way twice', highlight: true },
      { text: '.' },
    ],
  },
  {
    name: 'Md. Rakib Hasan',
    role: 'AI & Automation Expert',
    avatar: 'https://picsum.photos/seed/ghlprime-tt6/240/280',
    segments: [
      { text: 'AI is only as good as the workflow it is plugged into. ' },
      { text: 'At GHL Prime I sit with the strategy side before I ever touch a build', highlight: true },
      { text: ', so the automation actually solves the problem instead of ' },
      { text: 'just automating the mess', highlight: true },
      { text: '.' },
    ],
  },
  {
    name: 'Jewel Rana',
    role: 'CEO & Co-Founder',
    avatar: 'https://picsum.photos/seed/ghlprime-tt7/240/280',
    segments: [
      { text: 'We started GHL Prime because too many freelancers and agencies were drowning in manual work they never needed to do. ' },
      { text: 'Every system we build gets judged by one question: does this actually give our client their time back', highlight: true },
      { text: '. If it does not, ' },
      { text: 'we have not finished the job', highlight: true },
      { text: '.' },
    ],
  },
  {
    name: 'Niyamul Islam Sajal',
    role: 'COO & Co-Founder',
    avatar: 'https://picsum.photos/seed/ghlprime-tt8/240/280',
    segments: [
      { text: 'My job is making sure the CRM infrastructure and AI workflows we build for clients hold up long after the project ends. ' },
      { text: 'GHL Prime is not interested in automations that break the moment we walk away', highlight: true },
      { text: ', we build for ' },
      { text: 'the next two years, not the next two weeks', highlight: true },
      { text: '.' },
    ],
  },
];

// Slot pitch = face size + gap. Kept in JS as the single source of truth and
// pushed into CSS as custom properties, so the drag math and the layout can
// never drift apart.
const PITCH_V = 168
const PITCH_H = 150
const VISIBLE = 3

// How many extra slots render on each side of the active one. The rail
// loops infinitely (see the `active` comment below), so this only needs to
// comfortably outrun the fastest a drag/flick moves between frames -- it
// isn't tied to VISIBLE, which just sizes the viewport window.
const RAIL_BUFFER = 3

// Past this drag distance (px) a pointer-up is a drag, not a tap on a face.
const CLICK_SLOP = 6

const SPRING = { type: 'spring', stiffness: 260, damping: 34, mass: 0.9 }

// Wraps any integer (including negative) into a valid testimonials index.
const mod = (value, count) => ((value % count) + count) % count

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const list = window.matchMedia(query)
    setMatches(list.matches)
    const onChange = (event) => setMatches(event.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export default function TeamTestimonials({ testimonials = TESTIMONIALS, autoPlayMs = 6000 }) {
  const count = testimonials.length

  // `active` is an UNBOUNDED integer, not clamped to [0, count-1] -- it only
  // ever moves one slot at a time (arrows, autoplay, a drag settle). The
  // real testimonial and "is this slot active" checks both go through
  // mod(). That's what makes the rail loop forever in either direction
  // instead of running out of faces at the first/last person.
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)

  const isHorizontal = useMediaQuery('(max-width: 900px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const pitch = isHorizontal ? PITCH_H : PITCH_V
  const axis = isHorizontal ? 'x' : 'y'

  const railRef = useRef(null)
  const pos = useMotionValue(0)
  const [viewport, setViewport] = useState(PITCH_V * VISIBLE)

  // Measure the rail rather than assuming it: on mobile its width is fluid,
  // and the centering math needs the real size to place the active face.
  useEffect(() => {
    const node = railRef.current
    if (!node) return undefined

    const read = () => {
      const box = node.getBoundingClientRect()
      setViewport(isHorizontal ? box.width : box.height)
    }
    read()

    const observer = new ResizeObserver(read)
    observer.observe(node)
    return () => observer.disconnect()
  }, [isHorizontal])

  // Offset that puts virtual slot `index` in the centre of the rail
  // viewport. `index` can be any integer -- there's no real/virtual split
  // in the math, only in which testimonial a slot happens to render.
  const offsetFor = useCallback(
    (index) => viewport / 2 - pitch / 2 - index * pitch,
    [viewport, pitch],
  )

  // Keep the rail parked on the active slot whenever it changes from any
  // source (arrows, autoplay, keyboard) or the metrics change on resize.
  useEffect(() => {
    const controls = animate(pos, offsetFor(active), reducedMotion ? { duration: 0 } : SPRING)
    return () => controls.stop()
  }, [active, offsetFor, pos, reducedMotion])

  const next = useCallback(() => setActive((a) => a + 1), [])
  const prev = useCallback(() => setActive((a) => a - 1), [])

  // Settle on a specific virtual slot -- used by both "click a face" and
  // "end of a drag". Also animates explicitly, because when a drag lands
  // back on the already-active slot, `active` doesn't change and the effect
  // above wouldn't fire to pull the rail back into place.
  const settle = useCallback(
    (index) => {
      setActive(index)
      animate(pos, offsetFor(index), reducedMotion ? { duration: 0 } : SPRING)
    },
    [offsetFor, pos, reducedMotion],
  )

  const onDragEnd = (_event, info) => {
    setDragging(false)
    // Project a little past the release point so a flick carries further
    // than a slow drag of the same distance.
    const projected = pos.get() + info.velocity[axis] * 0.12
    settle(Math.round((offsetFor(0) - projected) / pitch))
  }

  // A pointer-up on a face is only a click if the pointer barely moved --
  // otherwise it's the end of a drag that happened to start on that face.
  const pointerStart = useRef(null)
  const onFacePointerDown = (event) => {
    pointerStart.current = { x: event.clientX, y: event.clientY }
  }
  const onFaceClick = (index, event) => {
    const start = pointerStart.current
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > CLICK_SLOP) return
    settle(index)
  }

  useEffect(() => {
    if (paused || dragging || count <= 1 || reducedMotion) return undefined
    // `active` is intentionally a dependency: re-running resets the interval
    // so manual navigation (click or drag) restarts the countdown instead
    // of cutting the next auto-advance short.
    const id = setInterval(next, autoPlayMs)
    return () => clearInterval(id)
  }, [paused, dragging, count, autoPlayMs, active, reducedMotion, next])

  const onKeyDown = (event) => {
    const forward = isHorizontal ? 'ArrowRight' : 'ArrowDown'
    const back = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
    if (event.key === forward) { event.preventDefault(); next() }
    if (event.key === back) { event.preventDefault(); prev() }
  }

  // The rendered rail window: RAIL_BUFFER virtual slots on each side of the
  // active one, so faces are always populated at every edge of the viewport
  // -- there's no first/last item to run out of, just `active` wrapped by
  // mod() as it moves.
  const railSlots = useMemo(
    () => Array.from({ length: RAIL_BUFFER * 2 + 1 }, (_, i) => active - RAIL_BUFFER + i),
    [active],
  )

  if (!count) return null

  const current = testimonials[mod(active, count)]
  const PrevIcon = isHorizontal ? ArrowLeft : ArrowUp
  const NextIcon = isHorizontal ? ArrowRight : ArrowDown

  return (
    <section
      className="section tt-section"
      style={{
        '--tt-pitch': `${PITCH_V}px`,
        '--tt-pitch-h': `${PITCH_H}px`,
        '--tt-viewport': `${PITCH_V * VISIBLE}px`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="Team testimonials"
    >
      <div className="container">
        <motion.div
          className="tt-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow-label">Team Voices</span>
          <h2>What It&rsquo;s Like Working Here</h2>
          <p>The people building GHL Prime, in their own words.</p>
        </motion.div>

        <div className="tt-stage">
          <div className="tt-rail" ref={railRef}>
            <motion.div
              className="tt-rail-track"
              style={{ [axis]: pos }}
              drag={axis}
              dragMomentum={false}
              onDragStart={() => setDragging(true)}
              onDragEnd={onDragEnd}
            >
              {railSlots.map((virtualIndex) => {
                const person = testimonials[mod(virtualIndex, count)]
                // Fixed pixel offset, independent of render order -- see
                // the note on .tt-rail-item in team-testimonials.css.
                const itemStyle = isHorizontal
                  ? { left: virtualIndex * pitch }
                  : { top: virtualIndex * pitch }
                return (
                  <div className="tt-rail-item" key={virtualIndex} style={itemStyle}>
                    <button
                      type="button"
                      className={`tt-face ${virtualIndex === active ? 'is-active' : ''}`}
                      aria-label={`Show testimonial from ${person.name}`}
                      aria-current={virtualIndex === active}
                      onPointerDown={onFacePointerDown}
                      onClick={(event) => onFaceClick(virtualIndex, event)}
                    >
                      <img src={person.avatar} alt="" loading="lazy" decoding="async" draggable="false" />
                    </button>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* aria-live so the quote swap is announced, since autoplay
              changes content without any user action. */}
          <div className="tt-quote" aria-live="polite">
            <div className="tt-badge" aria-hidden="true">
              <Quote size={22} fill="currentColor" strokeWidth={0} />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
                transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="tt-text">
                  {current.segments.map((seg, i) =>
                    seg.highlight
                      ? <span className="hl" key={i}>{seg.text}</span>
                      : <span key={i}>{seg.text}</span>,
                  )}
                </p>
                <div className="tt-meta">
                  <div className="tt-name">{current.name}</div>
                  <div className="tt-role">{current.role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="tt-nav">
            <button type="button" className="tt-arrow" aria-label="Previous testimonial" onClick={prev}>
              <PrevIcon size={18} />
            </button>
            <button type="button" className="tt-arrow" aria-label="Next testimonial" onClick={next}>
              <NextIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
