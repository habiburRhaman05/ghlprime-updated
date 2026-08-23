'use client'

import { createContext, useContext, useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import './depth.css'

/**
 * Depth: the 3D system the home page runs on.
 *
 * The old one tilted every surface toward the cursor and added a slow idle
 * wobble on top. Two problems with that: every card did the same thing, and
 * a rotating plate is flat -- nothing on it has depth relative to anything
 * else, it is one sheet turning.
 *
 * This works the other way round. Everything lives in a shared perspective
 * and moves along Z:
 *
 *   Stage  - owns the perspective and the pointer position
 *   Plane  - one surface at a real Z offset. Planes nearer the viewer travel
 *            further under the pointer, which is what actually reads as
 *            depth, and they dolly in from far away on mount.
 *   DepthCard - a card that arrives out of depth on scroll and pushes toward
 *            the viewer on hover, so its contents separate rather than skew.
 *
 * No rotation anywhere, which is the point: text stays square to the screen
 * and legible at every moment.
 */

const POINTER_SPRING = { stiffness: 80, damping: 18, mass: 0.7 }
const StageCtx = createContext(null)

/* ------------------------------------------------------------------ Stage */

export function Stage({ className = '', perspective = 1500, travel = 30, children, ...rest }) {
  const reduceMotion = useReducedMotion()
  const px = useSpring(useMotionValue(0), POINTER_SPRING)
  const py = useSpring(useMotionValue(0), POINTER_SPRING)

  const handleMove = (e) => {
    if (reduceMotion) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width - 0.5) * travel)
    py.set(((e.clientY - r.top) / r.height - 0.5) * travel)
  }

  const handleLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <StageCtx.Provider value={{ px, py }}>
      <div
        className={`m3d-stage ${className}`.trim()}
        style={{ perspective: `${perspective}px` }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        {...rest}
      >
        <div className="m3d-world">{children}</div>
      </div>
    </StageCtx.Provider>
  )
}

/* ------------------------------------------------------------------ Plane */

/**
 * `z` is the resting depth in px. Positive floats toward the viewer.
 * Note the entrance is driven through the same motion value as the resting
 * depth -- a `style` motion value beats an `animate` target for the same
 * transform key, so animating z through `animate` here would silently do
 * nothing.
 */
export function Plane({ z = 0, lag = 1, delay = 0, className = '', children, ...rest }) {
  const reduceMotion = useReducedMotion()
  const ctx = useContext(StageCtx)
  const idle = useMotionValue(0)
  const src = ctx || { px: idle, py: idle }

  const rate = (z / 100) * lag
  const x = useTransform(src.px, (v) => v * rate)
  const y = useTransform(src.py, (v) => v * rate)

  const target = useMotionValue(reduceMotion ? z : z - 340)
  const depth = useSpring(target, { stiffness: 52, damping: 17, mass: 0.9 })

  useEffect(() => {
    if (reduceMotion) {
      target.set(z)
      return undefined
    }
    const t = setTimeout(() => target.set(z), delay * 1000)
    return () => clearTimeout(t)
  }, [z, delay, target, reduceMotion])

  return (
    <motion.div
      className={`m3d-plane ${className}`.trim()}
      style={{ x, y, z: depth }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------- DepthCard */

const LIFT_SPRING = { stiffness: 200, damping: 26, mass: 0.7 }

export function DepthCard({
  as = 'article',
  className = '',
  wrapperClassName = '',
  index = 0,
  columns = 3,
  lift = 46,
  from = -300,
  amount = 0.22,
  once = true,
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion()
  const z = useSpring(useMotionValue(0), LIFT_SPRING)
  const Component = motion[as] || motion.article

  const handleEnter = () => {
    if (!reduceMotion) z.set(lift)
  }

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    // Read by the cursor wash in CSS.
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const handleLeave = () => z.set(0)

  return (
    <motion.div
      className={`m3d-slot ${wrapperClassName}`.trim()}
      style={{ transformPerspective: 1250 }}
      initial={{ opacity: 0, z: reduceMotion ? 0 : from, y: 20 }}
      whileInView={{ opacity: 1, z: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ type: 'spring', stiffness: 72, damping: 17, mass: 0.85, delay: (index % columns) * 0.1 }}
    >
      <Component
        className={`m3d-card ${className}`.trim()}
        style={{ z, transformPerspective: 1050 }}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        {...rest}
      >
        {children}
      </Component>
    </motion.div>
  )
}
