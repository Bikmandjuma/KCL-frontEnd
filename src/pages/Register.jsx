import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Coffee, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      navigate('/login')
    } catch {}
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-14 px-4 bg-cream-dark">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="w-14 h-14 rounded-full bg-espresso-900 flex items-center justify-center text-gold mb-3">
            <Coffee size={26} />
          </span>
          <h1 className="font-display text-2xl font-extrabold text-espresso-900">Join Kigali Coffee Lab</h1>
          <p className="text-espresso-400 text-sm mt-1">Create your client account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
              <input required className="input !pl-10" placeholder="yourusername"
                value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
              <input type="email" required className="input !pl-10" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
              <input className="input !pl-10" placeholder="07xx xxx xxx"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" size={18} />
              <input type="password" required minLength={6} className="input !pl-10" placeholder="At least 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <button disabled={loading} className="btn-primary w-full !py-3">
            {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-espresso-500 mt-6">
          Already have an account? <Link to="/login" className="text-gold-dark font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
