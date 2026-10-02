import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  ShoppingCart, Heart, Coffee, Menu, X,
  Info, Compass, Phone, Search, Sun, Moon,
  LayoutGrid, UtensilsCrossed, Cpu, GraduationCap, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { useTheme } from '../context/ThemeContext'
import SearchModal from './SearchModal'

const moreLinkClass = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
    isActive ? 'bg-espresso-50 text-espresso-900' : 'text-espresso-700 hover:bg-espresso-50'
  }`

const mainLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'text-gold' : 'text-cream-light/90 hover:text-gold'
  }`

const mainLinks = [
  { to: '/', label: 'Menu', icon: LayoutGrid, end: true },
  { to: '/coffee', label: 'Coffee', icon: Coffee },
  { to: '/food', label: 'Food', icon: UtensilsCrossed },
  { to: '/shop', label: 'Machine', icon: Cpu },
  { to: '/barista', label: 'Barista', icon: GraduationCap },
]

// The bottom tab bar (BottomNav) owns primary navigation on phones. On
// desktop (`lg:` and up) there's no bottom bar, so the same 5 destinations
// - plus a staff/admin entry point - live here in the top bar instead.
export default function Navbar() {
  const { isStaff } = useAuth()
  const { cartCount } = useCart()
  const { settings } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-espresso-900/95 backdrop-blur border-b border-espresso-800 shadow-soft">
      <div className="container-app flex items-center justify-between h-16 gap-2">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.jpg" alt="Kigali Coffee Lab" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <span className="font-display font-extrabold text-lg text-cream-light hidden sm:block">
            {settings.siteName}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {mainLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={mainLinkClass}>
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(true)} className="w-10 h-10 rounded-full flex items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Search">
            <Search size={18} />
          </button>

          <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Toggle theme">
            {theme === 'blue' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to="/wishlist" className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Wishlist">
            <Heart size={18} />
          </Link>

          <Link to="/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-espresso-900 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to={isStaff ? '/admin' : '/login'}
            className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-cream-light hover:bg-espresso-800 transition"
            aria-label={isStaff ? 'Admin panel' : 'Staff login'}
          >
            <ShieldCheck size={18} />
          </Link>

          <button className="w-10 h-10 flex items-center justify-center text-cream-light" onClick={() => setOpen(!open)} aria-label="More">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute right-4 top-16 w-56 bg-white rounded-xl shadow-soft border border-espresso-100 py-2 animate-fadeUp">
          <NavLink to="/about" onClick={() => setOpen(false)} className={moreLinkClass}><Info size={16} /> About Us</NavLink>
          <NavLink to="/mission-vision" onClick={() => setOpen(false)} className={moreLinkClass}><Compass size={16} /> Mission &amp; Vision</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className={moreLinkClass}><Phone size={16} /> Contact</NavLink>
          <NavLink to="/wishlist" onClick={() => setOpen(false)} className={`sm:hidden ${moreLinkClass({isActive:false})}`}><Heart size={16} /> Wishlist</NavLink>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
