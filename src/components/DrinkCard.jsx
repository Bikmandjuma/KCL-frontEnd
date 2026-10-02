import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, Plus, Minus, ShoppingCart } from 'lucide-react'
import { fileUrl } from '../api/axios'
import { formatRWF } from '../utils/format'
import { useCart } from '../context/CartContext'

export default function DrinkCard({ drink }) {
  const { cart, addToCart, updateQty } = useCart()
  const navigate = useNavigate()
  const key = `menu-${drink._id}`
  const inCart = cart?.find((i) => i.key === key)

  const add = () => {
    addToCart({ itemType: 'menu', itemId: drink._id, name: drink.name, price: drink.price, image: drink.image }, 1)
    navigate('/cart')
  }

  return (
    <div className="card overflow-hidden flex hover:-translate-y-1 transition-transform duration-300">
      <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-espresso-50 overflow-hidden">
        {drink.image ? (
          <img src={fileUrl(drink.image)} alt={drink.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-espresso-300">
            <Coffee size={32} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-center flex-1">
        <h4 className="font-display font-bold text-espresso-900">{drink.name}</h4>
        {drink.desc && <p className="text-sm text-espresso-500 line-clamp-2 mt-0.5">{drink.desc}</p>}
        <div className="mt-2 flex items-center justify-between">
          <span className="font-extrabold text-gold-dark">{formatRWF(drink.price)}</span>
          {inCart ? (
            <div className="flex items-center border border-espresso-200 rounded-full">
              <button onClick={() => updateQty(key, inCart.qty - 1)} className="w-8 h-8 flex items-center justify-center"><Minus size={13} /></button>
              <span className="w-6 text-center text-sm font-bold">{inCart.qty}</span>
              <button onClick={() => updateQty(key, inCart.qty + 1)} className="w-8 h-8 flex items-center justify-center"><Plus size={13} /></button>
            </div>
          ) : (
            <button onClick={add} className="btn-primary !px-3 !py-2 text-xs" aria-label="Add to cart">
              <ShoppingCart size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
