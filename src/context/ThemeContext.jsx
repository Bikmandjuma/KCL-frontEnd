import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// Default theme is "coffee" (espresso browns + gold) - identical on the
// guest storefront and the logged-in user/admin account. Toggling switches
// the whole app to the cool "blue" theme, persisted across visits.
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('kcl_theme') || 'coffee')

  useEffect(() => {
    if (theme === 'blue') {
      document.documentElement.setAttribute('data-theme', 'blue')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('kcl_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'coffee' ? 'blue' : 'coffee'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
export default ThemeContext
