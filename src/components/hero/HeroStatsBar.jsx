import { useEffect, useRef, useState } from 'react'
import './hero-stats-bar.css'

/*
 * The headline metrics bar. Lifted out of HeroAutomationCore (where it sat
 * under the hero illustration) into its own section directly below the hero,
 * so it spans the page rather than being tied to the width of the right-hand
 * visual column.
 *
 * Counters run on scroll-into-view rather than on mount: as a separate
 * section it can sit below the fold, and a count-up that finishes before it
 * is ever seen is just a static number with extra steps.
 */

const STATS = [
  { label: 'Live Products', value: 90, format: (v) => `${v}+` },
  { label: 'Users Served', value: 550, format: (v) => `${v}+` },
  { label: 'Enterprise Systems', value: 15, format: (v) => String(v) },
  { label: 'Years in Production', value: 7, format: (v) => `${v}+` },
]

const COUNT_MS = 1400

// Mirrors the matchMedia pattern used by the other home-page components.
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

function useCountUp(target, started, reduced, delay) {
  // Holds at 0 until `started`, so the final figure isn't briefly visible
  // before the animation begins.
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return undefined
    }
    if (!started) {
      setValue(0)
      return undefined
    }

    let frame = null
    let start = null

    const startTimer = window.setTimeout(() => {
      const step = (now) => {
        if (start === null) start = now
        const progress = Math.min((now - start) / COUNT_MS, 1)
        // easeOutCubic -- fast arrival, soft landing.
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) frame = window.requestAnimationFrame(step)
      }
      frame = window.requestAnimationFrame(step)
    }, delay)

    return () => {
      window.clearTimeout(startTimer)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [target, started, reduced, delay])

  return value
}

function StatTile({ stat, started, reduced, delay }) {
  const value = useCountUp(stat.value, started, reduced, delay)

  return (
    <div className="hsb-stat">
      <strong className="hsb-stat-value">{stat.format(value)}</strong>
      <span className="hsb-stat-label">
        {/* <span className="hsb-stat-dot" aria-hidden="true" /> */}
        {stat.label}
      </span>
    </div>
  )
}

export default function HeroStatsBar() {
  const reduced = usePrefersReducedMotion()
  const barRef = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const node = barRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setStarted(true)
        // Fire once -- re-counting on every scroll past would be noise.
        observer.disconnect()
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="hero-stats-section">
      <div className="container">
        <div className="hsb-bar" ref={barRef}>
          {STATS.map((stat, index) => (
            <StatTile
              key={stat.label}
              stat={stat}
              started={started}
              reduced={reduced}
              delay={index * 90}
            />
          ))}
        </div>
      </div>
    </section>
  )
}