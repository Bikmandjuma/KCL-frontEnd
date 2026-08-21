import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

// A compact, "beautiful" pagination control: prev/next arrows, first/last
// page always visible, current page range in the middle, ellipses for gaps.
export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null

  const items = []
  const add = (n) => items.push(n)
  const addDots = (key) => items.push(`dots-${key}`)

  add(1)
  if (page > 3) addDots('start')
  for (let p = Math.max(2, page - 1); p <= Math.min(pages - 1, page + 1); p++) add(p)
  if (page < pages - 2) addDots('end')
  if (pages > 1) add(pages)

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      <button
        className="page-btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {items.map((it) =>
        typeof it === 'string' ? (
          <span key={it} className="w-9 h-9 flex items-center justify-center text-espresso-300">
            <MoreHorizontal size={16} />
          </span>
        ) : (
          <button
            key={it}
            onClick={() => onChange(it)}
            className={it === page ? 'page-btn-active' : 'page-btn'}
          >
            {it}
          </button>
        )
      )}

      <button
        className="page-btn"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
