import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// A small floating entry point into the staff/admin side of the app,
// deliberately tucked into the bottom-right corner (above the customer
// bottom bar) rather than cluttering the primary customer navigation -
// customers never need it, but staff always know where to find it.
// Only shown on small/phone-sized viewports; on desktop the Navbar carries
// an equivalent icon instead (there's no bottom bar there to sit above of).
export default function AdminFab() {
  const { isStaff } = useAuth()

  return (
    <Link
      to={isStaff ? '/admin' : '/login'}
      aria-label={isStaff ? 'Admin panel' : 'Staff login'}
      className="lg:hidden fixed z-40 bottom-20 right-4 w-12 h-12 rounded-full bg-gold text-espresso-900 shadow-soft flex items-center justify-center hover:scale-110 hover:bg-gold-dark transition-transform"
    >
      <ShieldCheck size={22} />
    </Link>
  )
}
