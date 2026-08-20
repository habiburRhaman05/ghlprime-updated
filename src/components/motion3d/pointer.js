'use client'

/**
 * Pointer tracking for card surfaces that are NOT framer-motion elements.
 *
 * Writes four custom properties on the hovered element:
 *   --mx / --my  pointer position, used by the spotlight gradient
 *   --rx / --ry  rotation for the 3D hover tilt
 *
 * This only works where the stylesheet owns the element's transform. On a
 * framer-motion element framer writes an inline transform, which beats a
 * stylesheet :hover rule -- use TiltCard there instead.
 */
const MAX_TILT = 5

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function trackPointer(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  // The spotlight is a colour wash, not motion, so it stays either way.
  el.style.setProperty('--mx', `${x}px`)
  el.style.setProperty('--my', `${y}px`)
  if (prefersReducedMotion()) return
  el.style.setProperty('--ry', `${(x / r.width - 0.5) * MAX_TILT * 2}deg`)
  el.style.setProperty('--rx', `${-(y / r.height - 0.5) * MAX_TILT * 2}deg`)
}

export function resetPointer(e) {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}
