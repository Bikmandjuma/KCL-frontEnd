import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('kcl_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem('kcl_user', JSON.stringify(user))
    else localStorage.removeItem('kcl_user')
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setUser(data)
      toast.success(`Welcome back, ${data.username}! ☕`)
      return data
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      await api.post('/auth/register', payload)
      toast.success('Account created! Please sign in.')
      return true
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    toast('Signed out. See you soon! 👋', { icon: '☕' })
  }

  const isAdmin = !!(user && (user.isAdmin || user.role === 'admin'))
  const isManager = !!(user && user.role === 'manager')
  const isStaff = isAdmin || isManager
  const can = (perm) => isAdmin || !!(user?.permissions && user.permissions[perm])

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, isAdmin, isManager, isStaff, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
