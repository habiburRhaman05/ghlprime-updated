'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import './motion3d.css'

/**
 * Wraps a "device" visual (the hero console, the chat card, the code editor)
 * and tilts it in 3D toward the pointer.
 *
 * Spring-driven motion values rather than a CSS transition on `transform`:
 * a transition restarts on every mousemove, so the panel is always easing
 * toward a target that already moved and the tilt visibly trails the cursor.
 * A spring is continuous -- it tracks under the pointer and settles on its
 * own when the pointer leaves.
 *
 * `max` is the tilt in degrees at the very edge -- kept small on purpose:
 * past ~8deg the text on these panels starts to skew visibly.
 */
const MAX_TILT = 6
const SPRING = { stiffness: 110, damping: 22, mass: 0.85 }

export default function Tilt({ className = '', max = MAX_TILT, children, ...rest }) {
  const reduceMotion = useReducedMotion()
  const rotateX = useSpring(useMotionValue(0), SPRING)
  const rotateY = useSpring(useMotionValue(0), SPRING)

  const handleMove = (e) => {
    if (reduceMotion) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
  }

  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      className={`m3d-tilt ${className}`.trim()}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
