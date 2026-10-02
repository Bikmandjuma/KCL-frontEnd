import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Coffee, Cpu } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { fileUrl } from '../api/axios'
import { formatRWF } from '../utils/format'

export default function Cart() {
  const { cart, total, decreaseItem, updateQty, removeItem } = useCart()

  if (cart.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-espresso-300 mb-4" />
        <h2 className="section-title">Your cart is empty</h2>
        <p className="text-espresso-500 mt-2">Browse coffee, food, or a machine and add something you love.</p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Link to="/coffee" className="btn-primary">Coffee <ArrowRight size={16} /></Link>
          <Link to="/food" className="btn-outline">Food <ArrowRight size={16} /></Link>
          <Link to="/shop" className="btn-outline">Machines <ArrowRight size={16} /></Link>
        </div>
      </div>
    )
  }

  return (
    <CartInner cart={cart} total={total} decreaseItem={decreaseItem} updateQty={updateQty} removeItem={removeItem} />
  )
}

function CartInner({ cart, total, decreaseItem, updateQty, removeItem }) {
  const navigate = useNavigate()

  return (
    <div className="container-app py-10">
      <h1 className="section-title mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.key} className="card p-4 flex gap-4 items-center">
              {item.image ? (
                <img src={fileUrl(item.image)} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-espresso-50" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-espresso-50 flex items-center justify-center text-espresso-300">
                  {item.itemType === 'menu' ? <Coffee size={26} /> : <Cpu size={26} />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-espresso-900 truncate">{item.name}</h3>
                <p className="text-xs text-espresso-400">{item.itemType === 'menu' ? 'Coffee / Food' : 'Coffee Machine'}</p>
                <p className="text-gold-dark font-extrabold mt-1">{formatRWF(item.price)}</p>
              </div>
              <div className="flex items-center border border-espresso-200 rounded-full">
                <button onClick={() => decreaseItem(item.key, 1)} className="w-8 h-8 flex items-center justify-center"><Minus size={14}/></button>
                <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                <button onClick={() => updateQty(item.key, item.qty + 1)} className="w-8 h-8 flex items-center justify-center"><Plus size={14}/></button>
              </div>
              <button onClick={() => removeItem(item.key)} className="text-red-500 hover:text-red-700 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-display font-bold text-xl mb-4">Order Summary</h3>
          <div className="flex justify-between text-espresso-600 mb-2">
            <span>Subtotal</span><span>{formatRWF(total)}</span>
          </div>
          <div className="flex justify-between text-espresso-400 text-sm mb-4">
            <span>Delivery / service</span><span>Calculated at checkout</span>
          </div>
          <hr className="border-espresso-100 mb-4" />
          <div className="flex justify-between font-extrabold text-lg text-espresso-900 mb-6">
            <span>Total</span><span>{formatRWF(total)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full">
            Proceed to Checkout <ArrowRight size={18} />
          </button>
          <p className="text-xs text-espresso-400 text-center mt-3">No account needed. You'll get an order ID to track it.</p>
        </div>
      </div>
    </div>
  )
}
