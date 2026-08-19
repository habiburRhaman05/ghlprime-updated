import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import './life-at-ghl.css'

const LIFE_AT_IMAGES = [
  'DSC00041 (1).jpg',
  'DSC00043 (1).jpg',
  'DSC00056 (1).jpg',
  'DSC00061 (1).jpg',
  'DSC00064 (1).jpg',
  'DSC00071 (1).jpg',
  'DSC00072 (1).jpg',
  'DSC00082 (1).jpg',
  'DSC00110 (1).jpg',
  'DSC00111 (1).jpg',
  'DSC00353 (1).jpg',
  'DSC00361 (1).jpg',
  'DSC00382 (1).jpg',
]
const DUMMY_IMAGES = LIFE_AT_IMAGES.map((file, i) => ({
  id: `life-${i}`,
  image_url: `/life-at-images/${file.replace(/ /g, '%20')}`,
  title: 'Life at GHL Prime',
}))

const CARD_SIZES = ['sm', 'lg', 'md', 'xl', 'sm', 'lg', 'md', 'xl', 'sm', 'lg']

const SCROLL_SPEED = 0.2
const EASE = 0.12
const ACTIVATE_MARGIN = 200
const SETTLE_THRESHOLD = 0.5

function GalleryRow({ images, trackRef, sizeOffset = 0 }) {
  const trackItems = [...images, ...images]

  return (
    <div className="life-at-row-viewport">
      <div className="life-at-row" ref={trackRef}>
        {trackItems.map((img, index) => (
          <div
            key={`${img.id || img.image_url}-${index}`}
            className={`life-at-card size-${CARD_SIZES[(index + sizeOffset) % CARD_SIZES.length]}`}
          >
            <img src={img.image_url} alt={img.title || 'Life at GHL Prime'} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LifeAtGHL() {
  const midpoint = Math.ceil(DUMMY_IMAGES.length / 2)
  const rowOne = DUMMY_IMAGES.slice(0, midpoint)
  const rowTwo = DUMMY_IMAGES.slice(midpoint)

  const sectionRef = useRef(null)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)
  const state = useRef({
    target1: 0, target2: 0,
    current1: 0, current2: 0,
    width1: 0, width2: 0,
    lastY: 0,
    active: false,
    running: false,
    lastWrite1: null,
    lastWrite2: null,
  })

  useEffect(() => {
    if (!rowOne.length && !rowTwo.length) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    const measure = () => {
      state.current.width1 = row1Ref.current ? row1Ref.current.scrollWidth / 2 : 0
      state.current.width2 = row2Ref.current ? row2Ref.current.scrollWidth / 2 : 0
    }

    const wrap = (value, width) => {
      if (!width) return 0
      let m = value % width
      if (m > 0) m -= width
      return m
    }

    const handleScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - state.current.lastY
      state.current.lastY = currentY

      if (!state.current.active) return
      state.current.target1 += delta * SCROLL_SPEED
      state.current.target2 -= delta * SCROLL_SPEED
    }

    let frameId

    const setWillChange = (on) => {
      const v = on ? 'transform' : 'auto'
      if (row1Ref.current) row1Ref.current.style.willChange = v
      if (row2Ref.current) row2Ref.current.style.willChange = v
    }

    const tick = () => {
      const s = state.current
      s.current1 += (s.target1 - s.current1) * EASE
      s.current2 += (s.target2 - s.current2) * EASE

      if (Math.abs(s.target1 - s.current1) < SETTLE_THRESHOLD) s.current1 = s.target1
      if (Math.abs(s.target2 - s.current2) < SETTLE_THRESHOLD) s.current2 = s.target2

      const w1 = wrap(s.current1, s.width1)
      const w2 = wrap(s.current2, s.width2)

      if (row1Ref.current && w1 !== s.lastWrite1) {
        row1Ref.current.style.transform = `translate3d(${w1}px,0,0)`
        s.lastWrite1 = w1
      }
      if (row2Ref.current && w2 !== s.lastWrite2) {
        row2Ref.current.style.transform = `translate3d(${w2}px,0,0)`
        s.lastWrite2 = w2
      }

      const settled1 = s.current1 === s.target1
      const settled2 = s.current2 === s.target2

      if (s.active || !settled1 || !settled2) {
        frameId = window.requestAnimationFrame(tick)
      } else {
        s.running = false
        setWillChange(false)
      }
    }

    const startLoop = () => {
      if (state.current.running) return
      state.current.running = true
      state.current.lastWrite1 = null
      state.current.lastWrite2 = null
      setWillChange(true)
      frameId = window.requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasActive = state.current.active
        state.current.active = entry.isIntersecting
        if (!wasActive && entry.isIntersecting) startLoop()
      },
      { rootMargin: `${ACTIVATE_MARGIN}px 0px ${ACTIVATE_MARGIN}px 0px`, threshold: 0 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    measure()
    state.current.lastY = window.scrollY

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', measure)
    }
  }, [rowOne.length, rowTwo.length])

  if (!rowOne.length && !rowTwo.length) return null

  return (
    <section className="section life-at-ghl-section" ref={sectionRef}>
      <div className="container life-at-ghl-head">
        <motion.span
          className="eyebrow-label"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
        >
          Team Culture
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          Life At <span className="life-at-brand">GHL Prime</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          GHL Prime isn&rsquo;t just a remote team it&rsquo;s a group of builders, automators, and problem-solvers who show up for each other as much as for the work.
        </motion.p>
      </div>

      <div className="life-at-ghl-rows" aria-hidden="true">
        {rowOne.length ? <GalleryRow images={rowOne} trackRef={row1Ref} sizeOffset={0} /> : null}
        {rowTwo.length ? <GalleryRow images={rowTwo} trackRef={row2Ref} sizeOffset={3} /> : null}
      </div>

      <div className="container life-at-ghl-cta-row">
        <Link href="/gallery" className="secondary-pill">See Full Gallery</Link>
      </div>
    </section>
  )
}
