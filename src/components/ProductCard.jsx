import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, PackageX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fileUrl } from '../api/axios'
import { encodeId } from '../utils/idHash'
import { formatRWF } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isSaved, toggle } = useWishlist()
  const navigate = useNavigate()
  const liked = isSaved(product._id)
  const [busy, setBusy] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const outOfStock = product.quantity <= 0
  // Combine the primary image with any extra gallery shots. A product with
  // only one image simply stays static (no interval is ever started).
  const images = useMemo(() => {
    const list = [product.image, ...(product.gallery || [])].filter(Boolean)
    return list.length ? list : [product.image]
  }, [product.image, product.gallery])

  useEffect(() => {
    if (images.length <= 1) return
    const t = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length)
    }, 3000)
    return () => clearInterval(t)
  }, [images.length])

  const toggleWishlist = (e) => {
    e.preventDefault()
    toggle(product._id)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (outOfStock) return
    setBusy(true)
    addToCart({ itemType: 'machine', itemId: product._id, name: product.title, price: product.price, image: product.image }, 1)
    setBusy(false)
    navigate('/cart')
  }

  return (
    <Link
      to={`/product/${product.hash || encodeId(product._id)}`}
      className="group card overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-square bg-espresso-50 overflow-hidden">
        <img
          key={imgIndex}
          src={fileUrl(images[imgIndex])}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 animate-fadeSwap"
          loading="lazy"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIndex ? 'bg-gold' : 'bg-white/60'}`} />
            ))}
          </div>
        )}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur bg-white/80 shadow-soft transition-transform hover:scale-110 ${liked ? 'text-red-500' : 'text-espresso-400'}`}
          aria-label="Add to wishlist"
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
        </button>
        {/* {product.categories && (
          <span className="absolute top-3 left-3 badge bg-espresso-900/85 text-cream-light backdrop-blur">
            {product.categories}
          </span>
        )} */}
        {outOfStock && (
          <div className="absolute inset-0 bg-espresso-950/60 flex items-center justify-center text-cream-light font-bold gap-2">
            <PackageX size={18} /> Out of stock
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-display font-bold text-espresso-900 leading-snug line-clamp-2">{product.title}</h3>
        <p className="text-xs text-espresso-400">
          {product.quantity > 0 ? `${product.quantity} left in store` : 'Currently unavailable'}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-extrabold text-espresso-800">{formatRWF(product.price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || busy}
            className="btn-primary !px-3 !py-2 text-sm"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  )
}
