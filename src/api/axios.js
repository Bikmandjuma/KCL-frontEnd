import axios from 'axios'

// In dev, Vite proxies /api -> http://localhost:5050 (see vite.config.js)
// In prod, set VITE_API_URL to your deployed backend URL.
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('kcl_user')
  if (raw) {
    try {
      const user = JSON.parse(raw)
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`
      }
    } catch (e) {}
  }
  return config
})

export const fileUrl = (p) => {
  if (!p) return ''
  if (p.startsWith('http')) return p
  // In dev, Vite proxies /uploads straight to the backend (see vite.config.js).
  // In prod, set VITE_UPLOADS_URL to your backend origin (no /api suffix).
  const base = import.meta.env.VITE_UPLOADS_URL || ''
  return `${base}${p}`
}

export default api
