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
    <div className="min-h-[80vh] flex items-center justify-center py-14 px-4 bg-cream-dark">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="w-14 h-14 rounded-full bg-espresso-900 flex items-center justify-center text-gold mb-3">
            <Coffee size={26} />
          </span>
          <h1 className="font-display text-2xl font-extrabold text-espresso-900">Welcome Back</h1>
          <p className="text-espresso-400 text-sm mt-1">Sign in to Kigali Coffee Lab</p>
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
          Don't have an account? <Link to="/register" className="text-gold-dark font-semibold">Create one</Link>
        </p>
      </div>
    </div>
  )
}
