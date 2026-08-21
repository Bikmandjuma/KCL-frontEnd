import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/users/wishlist')
      setItems(data.wishlist || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="container-app py-10">
      <h1 className="section-title mb-8 flex items-center gap-2"><Heart className="text-red-500" fill="currentColor" /> My Wishlist</h1>
      {loading ? <Loader /> : items.length === 0 ? (
        <div className="text-center py-20 text-espresso-400">
          Nothing saved yet. <Link to="/shop" className="text-gold-dark font-semibold">Browse machines</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} wishlist={items.map(i=>i._id)} onWishlistChange={load} />
          ))}
        </div>
      )}
    </div>
  )
}
