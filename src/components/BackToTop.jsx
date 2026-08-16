import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import './back-to-top.css'

/*
 * Site-wide "back to top" affordance. Fixed bottom-left, so it never sits
 * in the same corner as the GHL chat widget loaded in App.jsx (LeadConnector
 * widgets dock bottom-right by default).
 *
 * The ring around the button is a live scroll-progress indicator -- how far
 * down the current page you are -- rather than a static decoration, so it
 * earns its place instead of just sitting there idle. Visibility and
 * progress are read from one rAF-batched scroll handler, matching the
 * pattern already used in TrainingOnboarding's scroll tracking.
 *
 * Hidden on /login and /admin/* the same way SiteHeader hides its own chrome
 * there -- those routes manage their own layout and scroll behaviour.
 */

const SHOW_AT = 420
const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

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

export default function BackToTop() {
  const location = useLocation()
  const isAuthLayout = location.pathname === '/login' || location.pathname.startsWith('/admin')
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    if (isAuthLayout) return undefined

    const measure = () => {
      frame.current = null
      const scrollTop = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setVisible(scrollTop > SHOW_AT)
      setProgress(max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0)
    }

    const onScroll = () => {
      if (frame.current) return
      frame.current = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isAuthLayout])

  if (isAuthLayout) return null

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`btt${visible ? ' is-visible' : ''}`}
      onClick={handleClick}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      {/* The icon badge carries the progress ring; the label sits outside it
          so the accessible name comes from the visible text rather than a
          duplicate aria-label. */}
      <span className="btt-badge">
   
        <ArrowUp className="" size={16} strokeWidth={2.6} aria-hidden="true" />
      </span>
      <span className="btt-label">Back to Top</span>
    </button>
  )
}
