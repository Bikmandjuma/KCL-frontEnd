import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Coffee, Package, ShoppingCart, Users, Settings, ArrowLeft, ShieldCheck, GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, isAdmin, can } = useAuth()

  const items = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: 'viewDashboard', end: true },
    { to: '/admin/products', label: 'Coffee Machines', icon: Package, perm: 'manageProducts' },
    { to: '/admin/drinks', label: 'Drinks Menu', icon: Coffee, perm: 'manageDrinks' },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart, perm: 'manageOrders' },
    { to: '/admin/barista', label: 'Barista Training', icon: GraduationCap, perm: 'manageBarista' },
    { to: '/admin/users', label: 'Users & Roles', icon: Users, perm: 'manageUsers' },
    { to: '/admin/settings', label: 'Settings', icon: Settings, perm: 'manageSettings' },
  ].filter((i) => isAdmin || can(i.perm))

  return (
    <div className="min-h-screen bg-cream-dark flex flex-col md:flex-row">
      <aside className="md:w-64 bg-espresso-950 text-cream-light shrink-0">
        <div className="p-5 flex items-center gap-2 border-b border-white/10">
          <span className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-espresso-900"><Coffee size={18} /></span>
          <div>
            <p className="font-display font-bold leading-tight">KCL Admin</p>
            <p className="text-xs text-cream-light/50 flex items-center gap-1">
              <ShieldCheck size={12} /> {isAdmin ? 'Administrator' : 'Manager'}
            </p>
          </div>
        </div>
        <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                  isActive ? 'bg-gold text-espresso-900' : 'text-cream-light/80 hover:bg-white/10'
                }`
              }
            >
              <i.icon size={17} /> {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 mt-2 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-cream-light/70 hover:bg-white/10">
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
