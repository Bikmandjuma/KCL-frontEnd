import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'

export default function Shop() {
  const { user } = useAuth()
  const [products, setProducts] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])

  const loadWishlist = async () => {
    if (!user) return setWishlist([])
    try {
      const { data } = await api.get('/users/wishlist')
      setWishlist((data.wishlist || []).map((p) => p._id))
    } catch {}
  }

  const load = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 12 }
      if (category) params.category = category
      if (search) params.search = search
      const { data } = await api.get('/products', { params })
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {})
    loadWishlist()
  }, [user])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [category, search, page])

  useEffect(() => { setPage(1) }, [category, search])

  const sorted = useMemo(() => {
    const arr = [...products.items]
    if (sort === 'price-asc') arr.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') arr.sort((a, b) => b.price - a.price)
    if (sort === 'stock') arr.sort((a, b) => b.quantity - a.quantity)
    return arr
  }, [products.items, sort])

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <span className="text-gold-dark font-bold text-sm uppercase tracking-wider">The Machine Shop</span>
        <h1 className="section-title">Coffee Machines</h1>
        <p className="text-espresso-500 mt-2 max-w-2xl">
          From manual pour-overs to full commercial units, find the right machine for your ritual.
        </p>
      </div>

      <div className="card p-4 mb-8 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
          <input
            className="input !pl-10"
            placeholder="Search machines (e.g. Espresso, French Press...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input md:w-56" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-2 md:w-56">
          <SlidersHorizontal size={18} className="text-espresso-400 shrink-0" />
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock">Most in stock</option>
          </select>
        </div>
      </div>

      {loading ? <Loader /> : sorted.length === 0 ? (
        <div className="text-center py-20 text-espresso-400">No machines match your search.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {sorted.map((p) => (
              <ProductCard key={p._id} product={p} wishlist={wishlist} onWishlistChange={loadWishlist} />
            ))}
          </div>
          <Pagination page={products.page} pages={products.pages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
