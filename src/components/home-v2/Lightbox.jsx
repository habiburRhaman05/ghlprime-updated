'use client'

import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import './home-v2.css'

/**
 * Full-screen viewer for a set of images.
 *
 * Rendered through a portal on document.body rather than in place: the
 * sections that use it sit inside stacking contexts (isolation, transforms),
 * and a `position: fixed` overlay nested inside one of those is clipped to
 * that ancestor instead of the viewport.
 *
 * `index` of null means closed.
 */
export default function Lightbox({ images, index, onClose, onStep }) {
  const open = index !== null && index >= 0 && images.length > 0

  const step = useCallback(
    (delta) => {
      if (!open) return
      onStep((index + delta + images.length) % images.length)
    },
    [open, index, images.length, onStep],
  )

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    // Hold the page still behind the overlay, and restore whatever overflow
    // the document had rather than assuming it was the default.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose, step])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="hv2-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <button type="button" className="hv2-lb-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>

          {images.length > 1 ? (
            <button
              type="button"
              className="hv2-lb-nav prev"
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); step(-1) }}
            >
              <ChevronLeft size={22} />
            </button>
          ) : null}

          <motion.img
            key={images[index]?.src}
            className="hv2-lb-image"
            src={images[index]?.src}
            alt={images[index]?.alt || ''}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            // A spring has no fixed end; AnimatePresence has to hold the
            // overlay until it settles, so the close is given its own tween.
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 160, damping: 24, mass: 0.7 }}
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="hv2-lb-nav next"
                aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); step(1) }}
              >
                <ChevronRight size={22} />
              </button>
              <span className="hv2-lb-count">{index + 1} / {images.length}</span>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
