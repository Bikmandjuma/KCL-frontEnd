import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api/axios'

// Fires a lightweight, best-effort visit ping every time the route changes,
// which powers the admin dashboard's traffic analytics.
export default function useTrackVisit() {
  const location = useLocation()
  useEffect(() => {
    api.post('/visits', { path: location.pathname }).catch(() => {})
  }, [location.pathname])
}
