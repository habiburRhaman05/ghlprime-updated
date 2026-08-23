'use client'

import { createContext, useContext } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const DepthContext = createContext(null)

/**
 * Tracks the pointer across a scene and shares spring-smoothed offsets with
 * every <Layer> inside, so a visual can be built as planes sitting at
 * different depths that separate as the cursor moves.
 */
export function DepthScene({ className = '', strength = 24, style, children, ...rest }) {
  const reduceMotion = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 55, damping: 16, mass: 0.6 })
  const y = useSpring(my, { stiffness: 55, damping: 16, mass: 0.6 })

  const handleMove = (e) => {
    if (reduceMotion) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * strength)
    my.set(((e.clientY - r.top) / r.height - 0.5) * strength)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <DepthContext.Provider value={{ x, y }}>
      <div className={className} onMouseMove={handleMove} onMouseLeave={handleLeave} style={style} {...rest}>
        {children}
      </div>
    </DepthContext.Provider>
  )
}

/**
 * One plane inside a DepthScene. Higher |depth| moves more with the pointer,
 * so negative values recede into the background and positive ones float
 * toward the viewer.
 */
export function Layer({ depth = 1, className = '', style, children }) {
  const ctx = useContext(DepthContext)
  const fallback = useMotionValue(0)
  const source = ctx || { x: fallback, y: fallback }
  const x = useTransform(source.x, (v) => v * depth)
  const y = useTransform(source.y, (v) => v * depth)

  return (
    <motion.div className={className} style={{ x, y, ...style }}>
      {children}
    </motion.div>
  )
}
