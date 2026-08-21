import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { fileUrl } from '../api/axios'
import { formatRWF } from '../utils/format'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { cart, decreaseItem, addToCart, removeItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const products = cart.products || []

  if (!user) {
    return (
      <div className="container-app py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-espresso-300 mb-4" />
        <h2 className="section-title">Sign in to view your cart</h2>
        <Link to="/login" className="btn-primary mt-6 inline-flex">Sign in</Link>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-espresso-300 mb-4" />
        <h2 className="section-title">Your cart is empty</h2>
        <p className="text-espresso-500 mt-2">Browse our coffee machines and add something you love.</p>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Shop Machines <ArrowRight size={16} /></Link>
      </div>
    )
  }

  return (
    <div className="container-app py-10">
      <h1 className="section-title mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {products.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4 items-center">
              <img src={fileUrl(item.image)} alt={item.title} className="w-20 h-20 object-cover rounded-xl bg-espresso-50" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-espresso-900 truncate">{item.title}</h3>
                <p className="text-gold-dark font-extrabold mt-1">{formatRWF(item.price)}</p>
              </div>
              <div className="flex items-center border border-espresso-200 rounded-full">
                <button onClick={() => decreaseItem(item.productId, 1)} className="w-8 h-8 flex items-center justify-center"><Minus size={14}/></button>
                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                <button onClick={() => addToCart({ _id: item.productId, title: item.title, price: item.price, image: item.image }, 1)} className="w-8 h-8 flex items-center justify-center"><Plus size={14}/></button>
              </div>
              <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-display font-bold text-xl mb-4">Order Summary</h3>
          <div className="flex justify-between text-espresso-600 mb-2">
            <span>Subtotal</span><span>{formatRWF(cart.total)}</span>
          </div>
          <div className="flex justify-between text-espresso-400 text-sm mb-4">
            <span>Delivery</span><span>Calculated at checkout</span>
          </div>
          <hr className="border-espresso-100 mb-4" />
          <div className="flex justify-between font-extrabold text-lg text-espresso-900 mb-6">
            <span>Total</span><span>{formatRWF(cart.total)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full">
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
