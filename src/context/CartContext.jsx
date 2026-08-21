import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState({ products: [], total: 0 })
  const [loading, setLoading] = useState(false)

  const refreshCart = useCallback(async () => {
    if (!user) { setCart({ products: [], total: 0 }); return }
    try {
      const { data } = await api.get('/carts/get-cart')
      setCart(data.cart || { products: [], total: 0 })
    } catch (e) { /* silent */ }
  }, [user])

  useEffect(() => { refreshCart() }, [refreshCart])

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error('Please sign in to add items to your cart')
      return false
    }
    setLoading(true)
    try {
      await api.post('/carts', {
        productId: product._id,
        quantity,
        title: product.title,
        price: product.price,
        image: product.image,
      })
      await refreshCart()
      toast.success(`${product.title} added to cart ☕`)
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart')
      return false
    } finally {
      setLoading(false)
    }
  }

  const decreaseItem = async (productId, quantity = 1) => {
    try {
      await api.post('/carts/decrease-quantity', { productId, quantity })
      await refreshCart()
    } catch (err) {
      toast.error('Could not update cart')
    }
  }

  const removeItem = async (productId) => {
    try {
      await api.post('/carts/remove-cart-item', { productId })
      await refreshCart()
      toast('Item removed from cart', { icon: '🗑️' })
    } catch (err) {
      toast.error('Could not remove item')
    }
  }

  const clearCart = async () => {
    try {
      await api.put('/carts/empty-cart')
      await refreshCart()
    } catch (err) {}
  }

  const cartCount = cart.products?.reduce((s, p) => s + p.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, addToCart, decreaseItem, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
export default CartContext
