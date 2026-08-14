import { ChevronLeft, ChevronRight } from 'lucide-react'

// Shared pagination control for admin list/table views. Purely presentational
// -- the page itself still owns `page` state and slices its own data; this
// just renders controls and reports page changes back up.
function buildPageWindow(page, totalPages) {
  const window = new Set([1, totalPages, page, page - 1, page + 1])
  return [...window].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = buildPageWindow(page, totalPages)

  return (
    <nav className="admin-pagination" aria-label="Pagination">
      <button
        type="button"
        className="admin-pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, index) => {
        const previous = pages[index - 1]
        const showGap = index > 0 && p - previous > 1
        return (
          <span key={p} style={{ display: 'contents' }}>
            {showGap ? <span className="admin-pagination-ellipsis">…</span> : null}
            <button
              type="button"
              className={`admin-pagination-btn ${p === page ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          </span>
        )
      })}

      <button
        type="button"
        className="admin-pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
