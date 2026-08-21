import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Heart, User, Menu, X, Coffee, LayoutDashboard, LogOut,
  Home as HomeIcon, Store, Info, Compass, Phone, Search, Sun, Moon,
  ChevronDown, GraduationCap, Utensils,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { useTheme } from '../context/ThemeContext'
import SearchModal from './SearchModal'

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'text-gold-dark' : 'text-cream-light/90 hover:text-gold'
  }`

export default function Navbar() {
  const { user, logout, isStaff } = useAuth()
  const { cartCount } = useCart()
  const { settings } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-espresso-900/95 backdrop-blur border-b border-espresso-800 shadow-soft">
      <div className="container-app flex items-center justify-between h-16 gap-2">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-espresso-900">
            <Coffee size={20} />
          </span>
          <span className="font-display font-extrabold text-lg text-cream-light hidden sm:block">
            {settings.siteName}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          <NavLink to="/" className={navLinkClass} end><HomeIcon size={15} /> Home</NavLink>
          <NavLink to="/shop" className={navLinkClass}><Store size={15} /> Shop Machines</NavLink>
          <NavLink to="/about" className={navLinkClass}><Info size={15} /> About Us</NavLink>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-cream-light/90 hover:text-gold transition-colors">
              <Utensils size={15} /> Services <ChevronDown size={13} />
            </button>
            <div className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-soft border border-espresso-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link to="/services" className="flex items-start gap-3 px-4 py-2.5 hover:bg-espresso-50">
                <Coffee size={16} className="text-gold-dark mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-espresso-900">Drinks &amp; Menu</p>
                  <p className="text-xs text-espresso-400">Explore our hot, cold &amp; specialty drinks</p>
                </div>
              </Link>
              <Link to="/services#barista" className="flex items-start gap-3 px-4 py-2.5 hover:bg-espresso-50">
                <GraduationCap size={16} className="text-gold-dark mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-espresso-900">Barista Training</p>
                  <p className="text-xs text-espresso-400">Learn the craft, apply for a session</p>
                </div>
              </Link>
            </div>
          </div>

          <NavLink to="/mission-vision" className={navLinkClass}><Compass size={15} /> Mission &amp; Vision</NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/contact" className="hidden md:flex w-10 h-10 rounded-full items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Contact">
            <Phone size={18} />
          </Link>

          <button onClick={() => setSearchOpen(true)} className="w-10 h-10 rounded-full flex items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Search">
            <Search size={18} />
          </button>

          <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Toggle theme">
            {theme === 'blue' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <Link to="/wishlist" className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Wishlist">
              <Heart size={18} />
            </Link>
          )}

          <Link to="/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-espresso-900 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group hidden lg:block">
              <button className="flex items-center gap-2 pl-2 pr-2 py-2 rounded-full hover:bg-espresso-800 transition text-cream-light" aria-label="Account">
                <span className="w-7 h-7 rounded-full bg-gold/90 text-espresso-900 flex items-center justify-center text-xs font-bold">
                  {user.username?.[0]?.toUpperCase()}
                </span>
              </button>
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-soft border border-espresso-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link to="/my-orders" className="block px-4 py-2 text-sm text-espresso-800 hover:bg-espresso-50">My Orders</Link>
                <Link to="/wishlist" className="block px-4 py-2 text-sm text-espresso-800 hover:bg-espresso-50">Wishlist</Link>
                {isStaff && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-espresso-800 hover:bg-espresso-50">
                    <LayoutDashboard size={15} /> Admin Panel
                  </Link>
                )}
                <button onClick={() => { logout(); navigate('/') }} className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center text-cream-light hover:bg-espresso-800 transition" aria-label="Sign in">
              <User size={18} />
            </Link>
          )}

          <button className="lg:hidden w-10 h-10 flex items-center justify-center text-cream-light" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-espresso-900 border-t border-espresso-800 px-4 py-3 space-y-1 animate-fadeUp">
          <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass} end><HomeIcon size={15} /> Home</NavLink>
          <NavLink to="/shop" onClick={() => setOpen(false)} className={navLinkClass}><Store size={15} /> Shop Machines</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)} className={navLinkClass}><Info size={15} /> About Us</NavLink>
          <NavLink to="/services" onClick={() => setOpen(false)} className={navLinkClass}><Utensils size={15} /> Services</NavLink>
          <NavLink to="/mission-vision" onClick={() => setOpen(false)} className={navLinkClass}><Compass size={15} /> Mission &amp; Vision</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className={navLinkClass}><Phone size={15} /> Contact</NavLink>
          <hr className="border-espresso-800 my-2" />
          {user ? (
            <>
              <Link to="/my-orders" onClick={() => setOpen(false)} className="block py-2 text-cream-light/90 text-sm font-semibold">My Orders</Link>
              <Link to="/wishlist" onClick={() => setOpen(false)} className="block py-2 text-cream-light/90 text-sm font-semibold">Wishlist</Link>
              {isStaff && <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-gold text-sm font-semibold">Admin Panel</Link>}
              <button onClick={() => { logout(); setOpen(false); navigate('/') }} className="block py-2 text-red-400 text-sm font-semibold">Sign out</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-gold text-sm font-semibold">Sign in</Link>
          )}
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
