import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const SettingsContext = createContext(null)

const defaultSettings = {
  siteName: 'Kigali Coffee Lab',
  tagline: 'Roasted with passion, brewed with purpose.',
  phone: '+250 700 000 000',
  whatsapp: '+250 700 000 000',
  address: 'KG 7 Ave, Kigali, Rwanda',
  momoPayNumber: '073 000 0000',
  momoCode: '',
  payments: { cashEnabled: true, momoPayEnabled: true, momoCodeEnabled: true },
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings)
  const [loaded, setLoaded] = useState(false)

  const refresh = async () => {
    try {
      const { data } = await api.get('/settings/public')
      setSettings({ ...defaultSettings, ...data })
    } catch (e) {
      // fall back to defaults silently if backend is unreachable
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => { refresh() }, [])

  return (
    <SettingsContext.Provider value={{ settings, loaded, refresh }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
export default SettingsContext
