import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Coffee, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch {}
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-14 px-4 bg-gray-200">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="Kigali Coffee Lab" className="w-14 h-14 rounded-full object-cover mb-3" />
          <h1 className="font-display text-2xl font-extrabold text-espresso-900">Staff Login</h1>
          <p className="text-espresso-400 text-sm mt-1">For Admin and Managers only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
              <input type="email" required className="input !pl-10" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
              <input type="password" required className="input !pl-10" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <button disabled={loading} className="btn-primary w-full !py-3">
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-espresso-500 mt-6">
          Just here to order coffee, food, or a machine? <Link to="/" className="text-gold-dark font-semibold">No account needed, browse the menu</Link>
        </p>
      </div>
    </div>
  )
}
