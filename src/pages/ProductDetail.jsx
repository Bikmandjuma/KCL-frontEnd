import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, ShoppingCart, Minus, Plus, ChevronLeft, PackageCheck, PackageX, Star } from 'lucide-react'
import api, { fileUrl } from '../api/axios'
import { formatRWF } from '../utils/format'
import Loader from '../components/Loader'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { hash } = useParams()
  const { addToCart } = useCart()
  const { isSaved, toggle } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/products/${hash}`)
      setProduct(data)
      setQty(1)
      setActiveImg(0)
    } catch {
      toast.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [hash])

  const liked = product ? isSaved(product._id) : false

  const increaseQty = () => {
    if (qty >= product.quantity) {
      toast.error(`Only ${product.quantity} left in stock. You cannot add more than that.`)
      return
    }
    setQty((q) => q + 1)
  }

  if (loading) return <Loader label="Loading machine details..." />
  if (!product) return null

  const outOfStock = product.quantity <= 0
  const images = [product.image, ...(product.gallery || [])].filter(Boolean)

  return (
    <div className="container-app py-10">
      <Link to="/shop" className="inline-flex items-center gap-1 text-espresso-500 hover:text-espresso-900 mb-6 text-sm font-semibold">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="card overflow-hidden aspect-square mb-3">
            <img src={fileUrl(images[activeImg])} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${i === activeImg ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={fileUrl(img)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.categories && <span className="badge bg-espresso-100 text-espresso-700 mb-3">{product.categories}</span>}
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-espresso-900">{product.title}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex text-gold">
              {[1,2,3,4,5].map((i) => <Star key={i} size={16} fill={i <= (product.totalRatings||0) ? 'currentColor' : 'none'} />)}
            </div>
            <span className="text-sm text-espresso-400">({product.ratings?.length || 0} reviews)</span>
          </div>

          <p className="text-3xl font-extrabold text-espresso-800 mt-5">{formatRWF(product.price)}</p>

          <div className={`mt-3 flex items-center gap-2 text-sm font-semibold ${outOfStock ? 'text-red-500' : 'text-green-700'}`}>
            {outOfStock ? <PackageX size={16} /> : <PackageCheck size={16} />}
            {outOfStock ? 'Out of stock' : `${product.quantity} left in store`}
          </div>

          <p className="text-espresso-600 leading-relaxed mt-5">{product.desc || 'A quality coffee machine from Kigali Coffee Lab.'}</p>

          {!outOfStock && (
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border border-espresso-200 rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center"><Minus size={16}/></button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button onClick={increaseQty} className="w-10 h-10 flex items-center justify-center"><Plus size={16}/></button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              disabled={outOfStock}
              onClick={() => addToCart(product, qty)}
              className="btn-primary flex-1 sm:flex-none"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button onClick={() => toggle(product._id)} className={`btn-outline ${liked ? '!bg-red-500 !text-white !border-red-500' : ''}`}>
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {liked ? 'Saved' : 'Wishlist'}
            </button>
          </div>

          <div className="mt-6 text-sm text-espresso-500 space-y-1">
            {product.brand && <p><span className="font-semibold text-espresso-700">Brand:</span> {product.brand}</p>}
            {product.color && <p><span className="font-semibold text-espresso-700">Colour:</span> {product.color}</p>}
            {product.size && <p><span className="font-semibold text-espresso-700">Size:</span> {product.size}</p>}
          </div>
        </div>
      </div>

      {/* Reviews - read-only, since leaving one needs identity and this
          storefront has no customer accounts. Staff can moderate via the
          admin panel if this ever needs to change. */}
      <div className="mt-16 max-w-2xl">
        <h3 className="font-display text-2xl font-bold text-espresso-900 mb-4">Reviews</h3>
        <div className="space-y-3">
          {(product.ratings || []).length === 0 && <p className="text-espresso-400 text-sm">No reviews yet.</p>}
          {(product.ratings || []).map((r, i) => (
            <div key={i} className="card p-4">
              <div className="flex text-gold mb-1">
                {[1,2,3,4,5].map((n) => <Star key={n} size={14} fill={n <= r.star ? 'currentColor' : 'none'} />)}
              </div>
              <p className="text-sm text-espresso-600">{r.comments}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
