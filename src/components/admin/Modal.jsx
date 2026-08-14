import { useEffect } from 'react'
import { X } from 'lucide-react'

// Shared glass-styled modal for every admin "Add X" form. Renders nothing
// while closed so closed forms don't cost layout space or run their effects
// unnecessarily. Closes on Escape or backdrop click; body scroll is locked
// while open so the page behind it doesn't scroll along with the modal.
export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="admin-modal-panel futuristic-card" role="dialog" aria-modal="true" aria-label={title}>
        <div className="admin-modal-head">
          <h2>{title}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  )
}
