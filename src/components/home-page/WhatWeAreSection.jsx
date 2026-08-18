import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, GraduationCap, Headphones, Users } from 'lucide-react'
import { fetchGalleryImages } from '../../lib/galleryApi'

// TODO: slides are pulled from Admin > Gallery (fetchGalleryImages). The list
// below is the fallback used until at least two gallery images exist, so the
// slider is never stuck on a single frame -- /who-we-are.jpg stays first so
// the section looks identical to before on its opening frame.
const WHAT_WE_ARE_FALLBACK_SLIDES = [

  { id: 'wwa-ph-2', image_url: '/GHL Organized FIle (2).png', title: 'The GHL Prime team' },
  { id: 'wwa-ph-1', image_url: '/GHL Organized FIle (1).png', title: 'The GHL Prime team' },
  { id: 'wwa-ph-3', image_url: '/GHL Organized FIle (3).png', title: 'The GHL Prime team' },
]

const WWA_SLIDE_MS = 4200
const WWA_MAX_SLIDES = 5

// Frame shape, derived from each photo (see `ratio` in the slider below).
// The default matches the original static image so the very first paint is
// unchanged; the clamps stop a stray portrait/panorama upload from making
// the card wildly taller or wider than the copy beside it.
const WWA_DEFAULT_RATIO = 1080 / 962
const WWA_MIN_RATIO = 0.72
const WWA_MAX_RATIO = 1.9

function WhatWeAreSlider() {
  const [slides, setSlides] = useState(WHAT_WE_ARE_FALLBACK_SLIDES)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  // The frame takes its shape from the photo rather than the other way round.
  // With a fixed ratio, a portrait image could only fit by height, leaving
  // bars down both sides -- matching the ratio is the only way to get full
  // width AND full height with nothing cropped and nothing stretched.
  const [ratio, setRatio] = useState(WWA_DEFAULT_RATIO)
  const ratioCache = useRef({})

  const rememberRatio = useCallback((src, width, height) => {
    if (!width || !height) return
    // Clamped so an unusually tall or wide upload can't blow the section's
    // proportions out next to the fixed-width copy column.
    const next = Math.min(Math.max(width / height, WWA_MIN_RATIO), WWA_MAX_RATIO)
    ratioCache.current[src] = next
    return next
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)
    const onChange = (event) => setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    let active = true
    fetchGalleryImages().then((images) => {
      if (!active) return
      const usable = (images || []).filter((img) => img?.image_url).slice(0, WWA_MAX_SLIDES)
      // Only take over from the fallback once there's actually enough to
      // slide through -- one gallery image would leave a dead carousel.
      if (usable.length >= 2) setSlides(usable)
    })
    return () => { active = false }
  }, [])

  const count = slides.length

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return undefined
    // `index` is a dependency on purpose: it restarts the countdown after a
    // manual dot click so the next auto-advance isn't cut short.
    const id = setInterval(() => setIndex((i) => (i + 1) % count), WWA_SLIDE_MS)
    return () => clearInterval(id)
  }, [paused, reducedMotion, count, index])

  // Warm the next image so the crossfade doesn't start against a blank frame
  // (only one slide is mounted at a time, so the browser wouldn't otherwise
  // fetch it until the swap has already begun). Measuring it here also means
  // its aspect ratio is already cached before it becomes the active slide.
  useEffect(() => {
    if (count < 2) return
    const nextSrc = slides[(index + 1) % count].image_url
    const next = new Image()
    next.onload = () => rememberRatio(nextSrc, next.naturalWidth, next.naturalHeight)
    next.src = nextSrc
  }, [index, count, slides])

  const active = slides[index]

  // Apply a cached ratio the moment the slide changes, so a revisited image
  // resizes the frame instantly rather than waiting on another load event.
  // When nothing is cached yet (the FIRST slide on a fresh page load) the
  // <img> onLoad can be missed: a cache-served image can finish loading
  // before React attaches the listener, leaving the frame stuck on the
  // default ratio. Probing with a fresh Image() -- listener attached before
  // src is set -- measures the file independently so the frame still snaps
  // to the photo's real shape.
  useEffect(() => {
    const url = active?.image_url
    if (!url) return
    const cached = ratioCache.current[url]
    if (cached) {
      setRatio(cached)
      return
    }
    const probe = new Image()
    probe.onload = () => {
      const measured = rememberRatio(url, probe.naturalWidth, probe.naturalHeight)
      if (measured) setRatio(measured)
    }
    probe.src = url
  }, [active, rememberRatio])

  return (
    <div
      className="what-we-are-image-card what-we-are-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="wwa-stage" style={{ aspectRatio: ratio }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id || active.image_url}
            className="wwa-slide"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: reducedMotion ? 0 : 0.85, ease: 'easeInOut' },

              scale: { duration: reducedMotion ? 0 : 7, ease: 'linear' },
            }}
          >
            {/* Blurred copy of the same file fills the box edge to edge so the
                contained photo above never sits on empty letterbox bars. Same
                URL, so it costs no extra network request. */}
            <img src={active.image_url} alt="" aria-hidden="true" className="wwa-slide-bg" decoding="async" />
            <img
              src={active.image_url}
              alt={active.title || 'The GHL Prime team'}
              className="wwa-slide-img"
              decoding="async"
              onLoad={(event) => {
                const measured = rememberRatio(
                  active.image_url,
                  event.currentTarget.naturalWidth,
                  event.currentTarget.naturalHeight,
                )
                if (measured) setRatio(measured)
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="wwa-arrow prev"
            aria-label="Previous image"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="wwa-arrow next"
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % count)}
          >
            <ChevronRight size={18} />
          </button>
          <div className="wwa-dots">
            {slides.map((slide, i) => (
              <button
                key={slide.id || slide.image_url}
                type="button"
                className={`wwa-dot ${i === index ? 'is-active' : ''}`}
                aria-label={`Show image ${i + 1} of ${count}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

const WHAT_WE_ARE_FEATURES = [
  { title: '24/7 Support', text: 'Always available when you need us', icon: Headphones, tone: 'blue' },
  { title: 'Expert Team', text: 'Specialists in GHL & automation', icon: Users, tone: 'green' },
  { title: 'Client Growth', text: 'We train, support & help you scale', icon: GraduationCap, tone: 'purple' },
]

export default function WhatWeAreSection() {
  return (
    <section className="section what-we-are-section">
      <div className="wwa-dot-grid" aria-hidden="true" />
      <div className="container what-we-are-layout">
        <div className="what-we-are-copy">
          <motion.div
            className="wwa-eyebrow-row"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.45 }}
          >
            <span className="eyebrow-label">What We Actually Are</span>
            {/* <span className="wwa-eyebrow-rule" aria-hidden="true" /> */}
          </motion.div>

          <motion.h2
            className="what-we-are-heading"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            We&rsquo;re not software. We&rsquo;re your <span className="accent">expert team.</span>
          </motion.h2>

          <motion.p
            className="what-we-are-lede"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Agencies and SaaS founders hire GHL Prime as their dedicated back-office: handling all the technical work, supporting their clients <span className="wwa-lede-hl">24/7</span>, and training them to grow.
          </motion.p>

          <motion.div
            className="wwa-features"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
          >
            {WHAT_WE_ARE_FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                className={`wwa-feature tone-${feature.tone}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <div className="wwa-feature-icon">
                  <feature.icon size={22} />
                </div>
                <strong>{feature.title}</strong>
                <p>{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <WhatWeAreSlider />
        </motion.div>
      </div>
    </section>
  )
}
