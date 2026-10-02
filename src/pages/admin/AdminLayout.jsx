import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Coffee, Package, ShoppingCart, Users, Settings, ArrowLeft,
  ShieldCheck, GraduationCap, LogOut, Grid3x3, X, Armchair,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { isAdmin, can, logout } = useAuth()
  const navigate = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)

  const items = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: 'viewDashboard', end: true },
    { to: '/admin/products', label: 'Coffee Machines', icon: Package, perm: 'manageProducts' },
    { to: '/admin/drinks', label: 'Drinks Menu', icon: Coffee, perm: 'manageDrinks' },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart, perm: 'manageOrders' },
    { to: '/admin/tables', label: 'Tables & Seats', icon: Armchair, perm: 'manageTables' },
    { to: '/admin/barista', label: 'Barista Training', icon: GraduationCap, perm: 'manageBarista' },
    { to: '/admin/users', label: 'Users & Roles', icon: Users, perm: 'manageUsers' },
    { to: '/admin/settings', label: 'Settings', icon: Settings, perm: 'manageSettings' },
  ].filter((i) => isAdmin || can(i.perm))

  // The 4 most-used sections sit directly on the bottom bar (phones); the
  // rest live behind the floating "more" button so the bar never crowds.
  const primary = items.slice(0, 4)
  const overflow = items.slice(4)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
      isActive ? 'bg-gold text-espresso-900' : 'text-cream-light/80 hover:bg-white/10'
    }`

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop sidebar - sticky so it stays put while only the body
          scrolls; its own dark background never touches the white body. */}
      <aside className="hidden md:flex md:w-64 md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-espresso-950 text-cream-light shrink-0 flex-col">
        <div className="p-5 flex items-center gap-2 border-b border-white/10">
          <img src="/logo.jpg" alt="KCL" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <div>
            <p className="font-display font-bold leading-tight">KCL Admin</p>
            <p className="text-xs text-cream-light/50 flex items-center gap-1">
              <ShieldCheck size={12} /> {isAdmin ? 'Administrator' : 'Manager'}
            </p>
          </div>
        </div>
        <nav className="p-3 flex flex-col gap-1 flex-1">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={navLinkClass}>
              <i.icon size={17} /> {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-cream-light/70 hover:bg-white/10">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/10">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar (branding + logout, since the sidebar is hidden here) */}
      <div className="md:hidden sticky top-0 z-30 bg-espresso-950 text-cream-light flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="KCL" className="w-8 h-8 rounded-full object-cover shrink-0" />
          <p className="font-display font-bold text-sm">KCL Admin</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-red-300">
          <LogOut size={15} /> Log out
        </button>
      </div>

      <main className="flex-1 p-5 md:p-8 min-w-0 pb-24 md:pb-8 bg-white">
        <Outlet />
      </main>

      {/* Mobile bottom bar + expandable "more" button */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-espresso-900/95 backdrop-blur border-t border-espresso-800">
        <div className="grid grid-cols-5">
          {primary.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold ${
                  isActive ? 'text-gold' : 'text-cream-light/60'
                }`
              }
            >
              <i.icon size={18} />
              {i.label.split(' ')[0]}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${moreOpen ? 'text-gold' : 'text-cream-light/60'}`}
          >
            {moreOpen ? <X size={18} /> : <Grid3x3 size={18} />}
            More
          </button>
        </div>
      </nav>

      {/* Overflow items animate upward from the "More" button when opened */}
      {overflow.length > 0 && (
        <div className={`md:hidden fixed bottom-16 right-3 z-40 flex flex-col items-end gap-2 ${moreOpen ? '' : 'pointer-events-none'}`}>
          {[...overflow].reverse().map((i, idx) => (
            <NavLink
              key={i.to}
              to={i.to}
              onClick={() => setMoreOpen(false)}
              className="flex items-center gap-2 bg-espresso-900 text-cream-light pl-4 pr-3 py-2.5 rounded-full shadow-soft text-sm font-semibold transition-all duration-300 ease-out"
              style={{
                opacity: moreOpen ? 1 : 0,
                transform: moreOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.9)',
                transitionDelay: moreOpen ? `${idx * 45}ms` : '0ms',
              }}
            >
              {i.label} <i.icon size={16} />
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
