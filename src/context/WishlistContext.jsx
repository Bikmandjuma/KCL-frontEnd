import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'kcl_wishlist'

// Guest-first wishlist: just a list of product ids saved locally, no
// account needed - matching the rest of the guest-first storefront.
export const WishlistProvider = ({ children }) => {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const isSaved = useCallback((id) => ids.includes(String(id)), [ids])

  const toggle = useCallback((id) => {
    const key = String(id)
    setIds((prev) => (prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]))
  }, [])

  return (
    <WishlistContext.Provider value={{ ids, isSaved, toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
export default WishlistContext
