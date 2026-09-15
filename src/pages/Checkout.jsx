import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Smartphone, Hash, CheckCircle2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { formatRWF } from '../utils/format'

export default function Checkout() {
  const { user } = useAuth()
  const { cart, clearCart } = useCart()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const [form, setForm] = useState({ address: '', contact: user?.phone || '', email: user?.email || '', notes: '' })
  const [method, setMethod] = useState(
    settings.payments?.cashEnabled ? 'Cash' : settings.payments?.momoPayEnabled ? 'MoMo Pay' : 'MoMo Code'
  )
  const [callConfirmed, setCallConfirmed] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  // This storefront only sells coffee machines, which the backend always
  // ships as `orderType: 'delivery'` (coffee/food ordering lives in the
  // KCL mobile app, not here) - so every option here is a delivery payment.
  const paymentOptions = [
    settings.payments?.cashEnabled && { id: 'Cash', label: 'Cash on Delivery', icon: Truck, desc: 'Pay in cash when your order arrives.' },
    settings.payments?.momoPayEnabled && { id: 'MoMo Pay', label: 'MoMo Pay', icon: Smartphone, desc: `Send to ${settings.momoPayNumber}, then upload your proof.` },
    settings.payments?.momoCodeEnabled && { id: 'MoMo Code', label: 'MoMo Code', icon: Hash, desc: `Pay to merchant code ${settings.momoCode || '(not set)'}, then upload your proof.` },
  ].filter(Boolean)

  const needsProof = method === 'MoMo Pay' || method === 'MoMo Code'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submitOrder = async (e) => {
    e.preventDefault()
    if (!cart.products?.length) return toast.error('Your cart is empty')
    if (!form.address || !form.contact) return toast.error('Please fill in your address and contact number')
    if (needsProof && !callConfirmed) {
      return toast.error(`Please confirm you've sent the payment first`)
    }
    setPlacing(true)
    try {
      const items = cart.products.map((p) => ({
        itemType: 'machine',
        itemId: p.productId,
        quantity: p.quantity,
      }))
      const { data } = await api.post('/orders', {
        items,
        address: form.address,
        contact: form.contact,
        email: form.email,
        notes: form.notes,
        customerName: user?.username,
        customerPhone: form.contact,
        paymentMethod: method,
        callConfirmed,
      })
      await clearCart()
      setPlacedOrder(data.order)
      toast.success('Order placed! ☕')
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not place order')
    } finally {
      setPlacing(false)
    }
  }

  if (placedOrder) {
    return <ProofUploadStep order={placedOrder} needsProof={needsProof} onDone={() => navigate('/my-orders')} />
  }

  return (
    <div className="container-app py-10 max-w-3xl">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={submitOrder} className="space-y-8">
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Delivery Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Delivery Address</label>
              <input name="address" className="input" placeholder="e.g. KG 11 Ave, Kimihurura, Kigali" value={form.address} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Contact Number</label>
              <input name="contact" className="input" placeholder="07xx xxx xxx" value={form.contact} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" className="input" value={form.email} onChange={handleChange} required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes (optional)</label>
              <textarea name="notes" className="input" rows={2} placeholder="Any delivery instructions..." value={form.notes} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Payment Method</h3>
          <div className="space-y-3">
            {paymentOptions.map((opt) => (
              <label key={opt.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${method === opt.id ? 'border-gold bg-gold/5' : 'border-espresso-100'}`}>
                <input type="radio" name="method" className="mt-1 accent-espresso-800" checked={method === opt.id} onChange={() => setMethod(opt.id)} />
                <opt.icon size={20} className="text-espresso-700 mt-0.5" />
                <div>
                  <p className="font-semibold text-espresso-900">{opt.label}</p>
                  <p className="text-sm text-espresso-500">{opt.desc}</p>
                </div>
              </label>
            ))}
            {paymentOptions.length === 0 && (
              <p className="text-sm text-espresso-400 italic">No payment methods are enabled yet - ask an admin to enable one in Settings.</p>
            )}
          </div>

          {needsProof && (
            <div className="mt-5 p-4 rounded-xl bg-gold/10 border border-gold/30">
              <p className="font-semibold text-espresso-800 mb-2">
                {method === 'MoMo Pay' ? 'MoMo Pay Details' : 'MoMo Code Details'}
              </p>
              <div className="bg-white rounded-lg p-3 border border-espresso-100 inline-block">
                <p className="text-espresso-400 text-xs">{method === 'MoMo Pay' ? 'MoMo Pay Number' : 'Merchant Code'}</p>
                <p className="font-bold text-espresso-900 text-base">
                  {method === 'MoMo Pay' ? settings.momoPayNumber : settings.momoCode}
                </p>
              </div>

              <p className="text-sm text-espresso-500 mt-3">
                After you've paid, you'll be able to upload a screenshot or photo as proof of
                payment on the next screen.
              </p>
              <label className="flex items-center gap-2 mt-3 text-sm font-semibold text-espresso-800">
                <input type="checkbox" className="accent-espresso-800 w-4 h-4" checked={callConfirmed} onChange={(e) => setCallConfirmed(e.target.checked)} />
                I confirm I have sent / will send the payment for this order
              </label>
            </div>
          )}
        </div>

        <div className="card p-6 flex items-center justify-between">
          <span className="text-espresso-500">Order Total</span>
          <span className="text-2xl font-extrabold text-espresso-900">{formatRWF(cart.total)}</span>
        </div>

        <button disabled={placing} className="btn-primary w-full !py-3.5 text-base">
          {placing ? 'Placing order...' : 'Place Order'} <ArrowRight size={18} />
        </button>
      </form>
    </div>
  )
}

function ProofUploadStep({ order, needsProof, onDone }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(!needsProof)

  const upload = async () => {
    if (!file) return toast.error('Please choose an image first')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('proof', file)
      await api.post(`/orders/${order._id}/proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Proof of payment uploaded! We will confirm shortly.')
      setDone(true)
    } catch {
      toast.error('Upload failed, please try again')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container-app py-16 max-w-xl text-center">
      <CheckCircle2 size={56} className="mx-auto text-green-600 mb-4" />
      <h1 className="section-title">Order Placed Successfully!</h1>
      <p className="text-espresso-500 mt-2">Order ID: <span className="font-mono">{order.orderCode}</span></p>

      {!done ? (
        <div className="card p-6 mt-8 text-left">
          <h3 className="font-display font-bold text-lg mb-2">Upload Proof of Payment</h3>
          <p className="text-sm text-espresso-500 mb-4">
            After paying, attach a screenshot or photo of your payment confirmation.
          </p>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input" />
          <button onClick={upload} disabled={uploading} className="btn-primary w-full mt-4">
            {uploading ? 'Uploading...' : 'Upload Proof'}
          </button>
          <button onClick={onDone} className="btn-ghost w-full mt-2 text-sm">I'll do this later from My Orders</button>
        </div>
      ) : (
        <button onClick={onDone} className="btn-primary mt-8">Go to My Orders</button>
      )}
    </div>
  )
}
