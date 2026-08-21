import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, ChevronLeft, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const emptyForm = {
  fullName: '', gender: '', phone: '', email: '',
  province: '', district: '', sector: '', cell: '', village: '',
}

export default function BaristaApply() {
  const [form, setForm] = useState(emptyForm)
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/barista/active-session')
      .then((r) => setSession(r.data))
      .finally(() => setChecking(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.gender || !form.phone || !form.email) {
      return toast.error('Please fill in your name, gender, phone and email')
    }
    setSubmitting(true)
    try {
      await api.post('/barista/apply', form)
      toast.success('Application submitted! We will contact you soon.')
      setDone(true)
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) return null

  if (done) {
    return (
      <div className="container-app py-24 max-w-lg text-center">
        <CheckCircle2 size={56} className="mx-auto text-green-600 mb-4" />
        <h1 className="section-title">Application Received</h1>
        <p className="text-espresso-500 mt-3">
          Thank you, {form.fullName}. Our team will reach out to {form.phone} or {form.email} with next steps.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">Back to Home</button>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container-app py-24 max-w-lg text-center">
        <GraduationCap size={56} className="mx-auto text-espresso-300 mb-4" />
        <h1 className="section-title">No Open Session</h1>
        <p className="text-espresso-500 mt-3">
          There is no open barista training session right now. Please check back soon.
        </p>
        <Link to="/services#barista" className="btn-primary mt-6 inline-flex">Back to Services</Link>
      </div>
    )
  }

  return (
    <div className="container-app py-10 max-w-2xl">
      <Link to="/services#barista" className="inline-flex items-center gap-1 text-espresso-500 hover:text-espresso-900 mb-6 text-sm font-semibold">
        <ChevronLeft size={16} /> Back to Services
      </Link>

      <div className="mb-8">
        <span className="badge bg-espresso-900 text-cream-light mb-3">{session.title}</span>
        <h1 className="section-title">Barista Training Application</h1>
        <p className="text-espresso-500 mt-2">{session.description}</p>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg mb-3">Personal Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Full Name</label>
              <input name="fullName" className="input" value={form.fullName} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Gender</label>
              <select name="gender" className="input" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="label">Phone</label>
              <input name="phone" className="input" placeholder="07xx xxx xxx" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Email</label>
              <input type="email" name="email" className="input" value={form.email} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-lg mb-3">Address</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Province</label>
              <input name="province" className="input" value={form.province} onChange={handleChange} />
            </div>
            <div>
              <label className="label">District</label>
              <input name="district" className="input" value={form.district} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Sector</label>
              <input name="sector" className="input" value={form.sector} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Cell</label>
              <input name="cell" className="input" value={form.cell} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Village</label>
              <input name="village" className="input" value={form.village} onChange={handleChange} />
            </div>
          </div>
        </div>

        <button disabled={submitting} className="btn-primary w-full !py-3">
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}
