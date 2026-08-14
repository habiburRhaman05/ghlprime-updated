import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Quote } from 'lucide-react'
import './team-testimonials.css'

// TODO: placeholder copy + avatars. Swap for real team quotes and photos
// (the Admin > Team manager already stores headshots via src/lib/teamApi.js).
const TESTIMONIALS = [
  {
    name: 'Tanvir Ahmed',
    role: 'Backend Developer',
    avatar: 'https://picsum.photos/seed/ghlprime-tt1/240/280',
    segments: [
      { text: 'Before joining, I thought remote teams always feel disconnected. ' },
      { text: 'GHL Prime proved me wrong', highlight: true },
      { text: '. Everyone actually shows up for each other, no matter the timezone. My manager checks in on ' },
      { text: "how I'm doing, not just what I'm shipping", highlight: true },
      { text: ", and that's rare to find." },
    ],
  },
  {
    name: 'Sabiha Sultana',
    role: 'Content Writer',
    avatar: 'https://picsum.photos/seed/ghlprime-tt2/240/280',
    segments: [
      { text: 'I used to dread commuting to the office, but ' },
      { text: 'GHL Prime', highlight: true },
      { text: ' changed everything. Working remotely in such a friendly environment is like a dream. Intern or CEO, everyone is treated with the ' },
      { text: 'same respect and warmth', highlight: true },
      { text: '. In seven years, this is the first place where I never have to hesitate about anything.' },
    ],
  },
  {
    name: 'Mahin Rahman',
    role: 'Automation Specialist',
    avatar: 'https://picsum.photos/seed/ghlprime-tt3/240/280',
    segments: [
      { text: 'What stands out to me is the ' },
      { text: 'creative freedom', highlight: true },
      { text: '. No one hands you a rigid brief and walks away — feedback here actually helps you grow. It genuinely feels like ' },
      { text: 'people want to see you do your best work', highlight: true },
      { text: ', not just finish tasks.' },
    ],
  },
  {
    name: 'Farhan Kabir',
    role: 'AI Agent Engineer',
    avatar: 'https://picsum.photos/seed/ghlprime-tt4/240/280',
    segments: [
      { text: "I've worked on distributed teams before, but never one where " },
      { text: 'async actually means trust', highlight: true },
      { text: ", not just a timezone workaround. Nobody's watching a clock here — they're watching whether the work lands. That's " },
      { text: 'a completely different way to be managed', highlight: true },
      { text: ', and it\'s the reason I stopped looking elsewhere.' },
    ],
  },
  {
    name: 'Nusrat Jahan',
    role: 'QA & Support Lead',
    avatar: 'https://picsum.photos/seed/ghlprime-tt5/240/280',
    segments: [
      { text: 'Support roles get treated as an afterthought most places. Here, ' },
      { text: 'my team actually acts on what I flag', highlight: true },
      { text: ' instead of filing it away. When a client escalation comes in at 2am my time, someone on another shift already ' },
      { text: 'has my back before I even wake up', highlight: true },
      { text: '.' },
    ],
  },
  {
    name: 'Rifat Chowdhury',
    role: 'Frontend Developer',
    avatar: 'https://picsum.photos/seed/ghlprime-tt6/240/280',
    segments: [
      { text: 'I joined expecting another agency grind. Instead I found ' },
      { text: 'people who genuinely care how a build turns out', highlight: true },
      { text: ', not just whether it shipped on time. Code review here is a conversation, not a gate — and ' },
      { text: "that's made me a better engineer", highlight: true },
      { text: ' in under a year.' },
    ],
  },
]

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
