import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, PackageSearch, Coffee, Cpu } from 'lucide-react'
import api, { fileUrl } from '../api/axios'
import { encodeId } from '../utils/idHash'
import { formatRWF } from '../utils/format'

export default function SearchModal({ open, onClose }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else { setQ(''); setResults([]) }
  }, [open])

  useEffect(() => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(() => {
      // One search box, everything in the database - both coffee machines
      // and menu (coffee/food) items come back from a single call.
      api.get('/search', { params: { q } })
        .then((r) => setResults(r.data))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const goToResult = (item) => {
    onClose()
    if (item.itemType === 'machine') {
      navigate(`/product/${item.hash || encodeId(item.id)}`)
    } else {
      navigate(item.menuType === 'food' ? '/food' : '/coffee')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-espresso-950/60 backdrop-blur-sm animate-fadeUp" onClick={onClose}>
      <div className="card w-full max-w-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-espresso-100">
          <Search size={20} className="text-espresso-400 shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search machines, coffee, food..."
            className="flex-1 outline-none text-espresso-900 placeholder:text-espresso-300 bg-transparent"
          />
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-espresso-50 flex items-center justify-center text-espresso-500 shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && <p className="text-center text-espresso-400 text-sm py-8">Searching...</p>}
          {!loading && q.trim() && results.length === 0 && (
            <div className="text-center text-espresso-400 text-sm py-10 flex flex-col items-center gap-2">
              <PackageSearch size={28} className="text-espresso-200" />
              No matches for &quot;{q}&quot;
            </div>
          )}
          {!loading && results.map((item) => (
            <button
              key={`${item.itemType}-${item.id}`}
              onClick={() => goToResult(item)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-espresso-50 text-left transition"
            >
              {item.image ? (
                <img src={fileUrl(item.image)} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-espresso-50 shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-espresso-50 flex items-center justify-center text-espresso-300 shrink-0">
                  {item.itemType === 'machine' ? <Cpu size={20} /> : <Coffee size={20} />}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-espresso-900 truncate">{item.name}</p>
                <p className="text-xs text-espresso-400">{item.category}{item.itemType === 'machine' ? ' · Machine' : ''}</p>
              </div>
              <span className="font-bold text-gold-dark shrink-0">{formatRWF(item.price)}</span>
            </button>
          ))}
          {!loading && !q.trim() && (
            <p className="text-center text-espresso-300 text-sm py-8">Start typing to search coffee, food, or machines.</p>
          )}
        </div>
      </div>
    </div>
  )
}
