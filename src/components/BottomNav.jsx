import { NavLink } from 'react-router-dom'
import { LayoutGrid, Coffee, UtensilsCrossed, Cpu, GraduationCap } from 'lucide-react'

const items = [
  { to: '/', label: 'Menu', icon: LayoutGrid, end: true },
  { to: '/coffee', label: 'Coffee', icon: Coffee },
  { to: '/food', label: 'Food', icon: UtensilsCrossed },
  { to: '/shop', label: 'Machine', icon: Cpu },
  { to: '/barista', label: 'Barista', icon: GraduationCap },
]

// A persistent, mobile-app-style bottom tab bar for the 5 things a
// customer actually comes here to do. Shown only on small/phone-sized
// viewports (`lg:hidden`) - on desktop the same 5 destinations live in the
// top Navbar instead, since a bottom bar reads as unusual on a wide screen.
export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-espresso-900/95 backdrop-blur border-t border-espresso-800 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-lg mx-auto grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-gold' : 'text-cream-light/60 hover:text-cream-light'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-gold/15' : ''}`}>
                  <Icon size={19} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
