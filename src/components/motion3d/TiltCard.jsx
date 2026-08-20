'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import './motion3d.css'

/**
 * A card with two independent 3D behaviours:
 *
 *   - the OUTER element runs the scroll entrance (a rotateX unfold)
 *   - the INNER element runs the pointer tilt
 *
 * They have to be separate elements. Both want to write `transform`, and a
 * framer `style` motion value always beats an `animate` target for the same
 * key -- so driving the entrance and the tilt from one element means the
 * entrance silently never plays. Splitting them also means neither can beat
 * the other as the pointer moves mid-reveal.
 *
 * (A stylesheet `:hover` transform is not an option here either: framer owns
 * the inline transform on both elements, and inline always wins.)
 */
const MAX_TILT = 6
const SPRING = { stiffness: 150, damping: 21, mass: 0.75 }

export default function TiltCard({
  as = 'article',
  className = '',
  wrapperClassName = '',
  reveal,
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion()
  const rotateX = useSpring(useMotionValue(0), SPRING)
  const rotateY = useSpring(useMotionValue(0), SPRING)
  const Component = motion[as]

  const handleMove = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    // The spotlight gradient reads these two from CSS.
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (reduceMotion) return
    rotateY.set((x / r.width - 0.5) * MAX_TILT * 2)
    rotateX.set(-(y / r.height - 0.5) * MAX_TILT * 2)
  }

  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div className={wrapperClassName} {...reveal}>
      <Component
        className={className}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        whileHover={
        reduceMotion
          ? undefined
          : { y: -6, scale: 1.015, transition: { type: 'spring', stiffness: 260, damping: 24, mass: 0.7 } }
      }
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        {...rest}
      >
        {children}
      </Component>
    </motion.div>
  )
}
