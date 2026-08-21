import { useEffect, useState } from 'react'
import { CreditCard, Smartphone, Truck, CheckCircle2, Save, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import { useSettings } from '../../context/SettingsContext'
import { useAuth } from '../../context/AuthContext'

const sections = [
  { id: 'payment', label: 'Payment Method' },
  { id: 'info', label: 'Site Info' },
  { id: 'password', label: 'Password' },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full relative transition-colors ${checked ? 'bg-green-600' : 'bg-espresso-200'}`}
    >
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform shadow ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

export default function AdminSettings() {
  const { refresh } = useSettings()
  const { user } = useAuth()
  const [section, setSection] = useState('payment')
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [password, setPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    api.get('/settings').then((r) => setSettings(r.data)).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const { payments, ...flatSettings } = settings
      await api.put('/settings', flatSettings)
      toast.success('Settings saved')
      refresh()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not save settings')
    } finally { setSaving(false) }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setChangingPassword(true)
    try {
      await api.put(`/users/${user._id}`, { password })
      toast.success('Password updated')
      setPassword('')
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not update password')
    } finally { setChangingPassword(false) }
  }

  if (loading || !settings) return <Loader />

  const setPayments = (key, val) => setSettings({ ...settings, [key]: val })

  return (
    <div className="max-w-3xl">
      <h1 className="section-title mb-2">Settings</h1>
      <p className="text-espresso-500 text-sm mb-6">Control site info, payment visibility, and your own password.</p>

      <div className="mb-8 max-w-xs">
        <select value={section} onChange={(e) => setSection(e.target.value)} className="input font-semibold">
          {sections.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {section === 'payment' && (
        <div className="card p-6 mb-6">
          <h3 className="font-display font-bold text-lg mb-1">Payment Methods</h3>
          <p className="text-sm text-espresso-500 mb-4">
            Toggle which payment options clients actually see at checkout. Everything here is real
            and takes effect immediately once saved.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-espresso-50">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-espresso-700" />
                <div>
                  <p className="font-semibold text-espresso-800">Cash on Delivery</p>
                  <p className="text-xs text-espresso-500">Client pays cash when the order arrives.</p>
                </div>
              </div>
              <Toggle checked={settings.codEnabled} onChange={(v) => setPayments('codEnabled', v)} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-espresso-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-espresso-700" />
                <div>
                  <p className="font-semibold text-espresso-800">Manual Proof of Payment</p>
                  <p className="text-xs text-espresso-500">Client calls, pays by bank/cash, then uploads proof.</p>
                </div>
              </div>
              <Toggle checked={settings.manualProofEnabled} onChange={(v) => setPayments('manualProofEnabled', v)} />
            </div>

            <div className="p-4 rounded-xl bg-espresso-50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className="text-espresso-700" />
                  <div>
                    <p className="font-semibold text-espresso-800">MTN Mobile Money</p>
                    <p className="text-xs text-espresso-500">Shown to clients only once enabled here.</p>
                  </div>
                </div>
                <Toggle checked={settings.mtnEnabled} onChange={(v) => setPayments('mtnEnabled', v)} />
              </div>
              {settings.mtnEnabled && (
                <div className="grid sm:grid-cols-2 gap-3 pl-8">
                  <div>
                    <label className="label">MTN MoMo Pay Number</label>
                    <input className="input" value={settings.mtnNumber} onChange={(e) => setSettings({ ...settings, mtnNumber: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">MTN MoMo Pay Code</label>
                    <input className="input" placeholder="e.g. 123456" value={settings.mtnCode || ''} onChange={(e) => setSettings({ ...settings, mtnCode: e.target.value })} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-espresso-50">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-espresso-700" />
                <div>
                  <p className="font-semibold text-espresso-800">Visa / Credit Card (Stripe)</p>
                  <p className="text-xs text-espresso-500">Enable once you are ready to accept live card payments.</p>
                </div>
              </div>
              <Toggle checked={settings.stripeEnabled} onChange={(v) => setPayments('stripeEnabled', v)} />
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn-primary mt-6">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Payment Settings'}
          </button>
        </div>
      )}

      {section === 'info' && (
        <div className="card p-6 mb-6">
          <h3 className="font-display font-bold text-lg mb-4">Site Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Site Name</label>
              <input className="input" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Tagline</label>
              <input className="input" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Address</label>
              <input className="input" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </div>
          </div>
          <button onClick={save} disabled={saving} className="btn-primary mt-6">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Site Info'}
          </button>
        </div>
      )}

      {section === 'password' && (
        <form onSubmit={changePassword} className="card p-6 mb-6 max-w-md">
          <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2"><Lock size={18} /> Change Password</h3>
          <p className="text-sm text-espresso-500 mb-4">Update the password for your own account.</p>
          <label className="label">New Password</label>
          <input type="password" minLength={6} required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={changingPassword} className="btn-primary mt-4">
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  )
}
