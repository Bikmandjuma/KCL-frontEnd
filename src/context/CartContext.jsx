import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)
const STORAGE_KEY = 'kcl_cart'

// Guest-first cart: no account needed, matching the mobile app and the
// backend's guest checkout (POST /orders with an `items` array). Lives in
// localStorage so it survives a page refresh, but never touches the server
// until the customer actually places the order.
//
// Each line: { key, itemType: 'menu' | 'machine', itemId, name, price, image, qty }
// `key` = `${itemType}-${itemId}` so a coffee and a machine can never collide
// even if their raw numeric ids overlap.
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((item, qty = 1) => {
    const itemType = item.itemType || 'machine'
    const itemId = item.itemId ?? item._id ?? item.id
    const key = `${itemType}-${itemId}`
    const name = item.name || item.title
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { key, itemType, itemId, name, price: item.price, image: item.image, qty }]
    })
    toast.success(`${name} added to cart ☕`)
    return true
  }, [])

  const updateQty = useCallback((key, qty) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    )
  }, [])

  const decreaseItem = useCallback((key, by = 1) => {
    setCart((prev) => {
      const item = prev.find((i) => i.key === key)
      if (!item) return prev
      const newQty = item.qty - by
      return newQty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty: newQty } : i))
    })
  }, [])

  const removeItem = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key))
    toast('Item removed from cart', { icon: '🗑️' })
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, cartCount, total, addToCart, updateQty, decreaseItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
export default CartContext
