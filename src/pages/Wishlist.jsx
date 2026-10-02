import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist() {
  const { ids } = useWishlist()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          ids.map((id) => api.get(`/products/${id}`).then((r) => r.data).catch(() => null))
        )
        if (!cancelled) setItems(results.filter(Boolean))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [ids])

  return (
    <div className="container-app py-10">
      <h1 className="section-title mb-8 flex items-center gap-2"><Heart className="text-red-500" fill="currentColor" /> My Wishlist</h1>
      {loading ? <Loader /> : items.length === 0 ? (
        <div className="text-center py-20 text-espresso-400">
          Nothing saved yet. <Link to="/shop" className="text-gold-dark font-semibold">Browse machines</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  )
}
