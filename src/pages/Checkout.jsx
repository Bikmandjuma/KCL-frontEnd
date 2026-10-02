import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Truck, Smartphone, Hash, CheckCircle2, ArrowRight, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useSettings } from '../context/SettingsContext'
import { formatRWF } from '../utils/format'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const hasMenuItems = cart.some((i) => i.itemType === 'menu')
  const hasMachineItems = cart.some((i) => i.itemType === 'machine')

  // Coffee/food can never be delivered - the customer either sits at a
  // table in the shop (dine_in) or orders ahead (e.g. from home) to
  // collect later with no table (pickup). A machine-only cart is delivery.
  const [serviceType, setServiceType] = useState('dine_in') // 'dine_in' | 'pickup', only relevant when hasMenuItems
  const orderType = hasMenuItems ? serviceType : 'delivery'

  const [tables, setTables] = useState([])
  const [tableId, setTableId] = useState(null)
  const [tablesLoading, setTablesLoading] = useState(false)
  const [addingTable, setAddingTable] = useState(false)
  const [newTableLabel, setNewTableLabel] = useState('')
  const [newTableSeats, setNewTableSeats] = useState('4')
  const [creatingTable, setCreatingTable] = useState(false)

  const [form, setForm] = useState({ address: '', contact: '', email: '', customerName: '', notes: '' })
  const [method, setMethod] = useState(
    settings.payments?.cashEnabled ? 'Cash' : settings.payments?.momoPayEnabled ? 'MoMo Pay' : 'MoMo Code'
  )
  const [callConfirmed, setCallConfirmed] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)

  const loadTables = () => {
    setTablesLoading(true)
    api.get('/tables').then((r) => setTables(r.data || [])).finally(() => setTablesLoading(false))
  }

  useEffect(() => {
    if (orderType !== 'dine_in') return
    loadTables()
  }, [orderType])

  const createTable = async () => {
    if (!newTableLabel.trim()) return toast.error('Give the table a label, e.g. "Table 7"')
    setCreatingTable(true)
    try {
      const { data } = await api.post('/tables', { label: newTableLabel.trim(), capacity: Number(newTableSeats) || 4 })
      setTables((prev) => [...prev, data])
      setTableId(data.id)
      setAddingTable(false)
      setNewTableLabel('')
      toast.success(`${data.label} added and selected for your order`)
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not add that table')
    } finally {
      setCreatingTable(false)
    }
  }

  const shippingFee = orderType === 'delivery' ? 20 : 0
  const grandTotal = total + shippingFee
  const needsProof = method === 'MoMo Pay' || method === 'MoMo Code'
  const paymentOptions = [
    settings.payments?.cashEnabled && { id: 'Cash', label: orderType === 'delivery' ? 'Cash on Delivery' : 'Cash', icon: Truck, desc: orderType === 'delivery' ? 'Pay in cash when your order arrives.' : 'Pay in cash at the counter.' },
    settings.payments?.momoPayEnabled && { id: 'MoMo Pay', label: 'MoMo Pay', icon: Smartphone, desc: `Send to ${settings.momoPayNumber}, then upload your proof.` },
    settings.payments?.momoCodeEnabled && { id: 'MoMo Code', label: 'MoMo Code', icon: Hash, desc: `Pay to merchant code ${settings.momoCode || '(not set)'}, then upload your proof.` },
  ].filter(Boolean)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submitOrder = async (e) => {
    e.preventDefault()
    if (!cart.length) return toast.error('Your cart is empty')
    if (orderType === 'dine_in' && !tableId) return toast.error('Please choose a table')
    if (orderType === 'delivery' && !form.address) return toast.error('A delivery address is required')
    if (needsProof && !callConfirmed) return toast.error(`Please confirm you've sent the payment first`)

    setPlacing(true)
    try {
      const items = cart.map((i) => ({ itemType: i.itemType, itemId: i.itemId, quantity: i.qty }))
      const { data } = await api.post('/orders', {
        items,
        orderType: hasMenuItems ? serviceType : undefined,
        tableId: orderType === 'dine_in' ? tableId : undefined,
        address: orderType === 'delivery' ? form.address : undefined,
        contact: form.contact,
        email: form.email,
        notes: form.notes,
        customerName: form.customerName,
        customerPhone: form.contact,
        paymentMethod: method,
        callConfirmed,
      })
      clearCart()
      // TrackOrder.jsx picks this up on mount so "See My Order" lands
      // straight on this order's live status, no re-typing the code.
      localStorage.setItem('kcl_last_order_code', data.order.orderCode)
      setPlacedOrder(data.order)
      toast.success('Order placed! ☕')
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not place order')
    } finally {
      setPlacing(false)
    }
  }

  if (placedOrder) {
    return <ProofUploadStep order={placedOrder} needsProof={needsProof} onDone={() => navigate('/track')} />
  }

  if (!cart.length) {
    return (
      <div className="container-app py-24 text-center">
        <h2 className="section-title">Nothing to check out yet</h2>
        <Link to="/coffee" className="btn-primary mt-6 inline-flex">Browse the menu <ArrowRight size={16} /></Link>
      </div>
    )
  }

  return (
    <div className="container-app py-10 max-w-3xl">
      <h1 className="section-title mb-8">Checkout</h1>

      <form onSubmit={submitOrder} className="space-y-8">
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Your Details <span className="text-espresso-400 font-normal text-sm">(optional)</span></h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input name="customerName" className="input" placeholder="e.g. Aimable" value={form.customerName} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input name="contact" className="input" placeholder="07xx xxx xxx" value={form.contact} onChange={handleChange} />
            </div>
          </div>
        </div>

        {hasMenuItems && (
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg mb-4">Where are you ordering from?</h3>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setServiceType('dine_in')} className={`p-4 rounded-xl border-2 text-left transition ${serviceType === 'dine_in' ? 'border-gold bg-gold/5' : 'border-espresso-100'}`}>
                <p className="font-bold text-espresso-900">I'm at the shop</p>
                <p className="text-xs text-espresso-500 mt-1">Pick a table, we'll bring it to you.</p>
              </button>
              <button type="button" onClick={() => setServiceType('pickup')} className={`p-4 rounded-xl border-2 text-left transition ${serviceType === 'pickup' ? 'border-gold bg-gold/5' : 'border-espresso-100'}`}>
                <p className="font-bold text-espresso-900">Ordering from home</p>
                <p className="text-xs text-espresso-500 mt-1">No table needed, collect it at the counter.</p>
              </button>
            </div>

            {serviceType === 'dine_in' && (
              <div className="mt-4">
                <label className="label">Pick your table</label>
                {tablesLoading ? (
                  <p className="text-sm text-espresso-400">Loading tables...</p>
                ) : tables.length === 0 ? (
                  <p className="text-sm text-espresso-400">No tables yet. Add one below.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tables.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTableId(t.id)}
                        className={`p-3 rounded-xl border-2 text-sm font-semibold transition ${tableId === t.id ? 'border-gold bg-gold/5 text-espresso-900' : 'border-espresso-100 text-espresso-600'}`}
                      >
                        {t.label}
                        <span className="block text-xs font-normal text-espresso-400">seats {t.capacity}</span>
                      </button>
                    ))}
                  </div>
                )}

                {addingTable ? (
                  <div className="mt-3 p-4 rounded-xl border-2 border-dashed border-gold/40 bg-gold/5">
                    <p className="text-sm font-semibold text-espresso-800 mb-2">Add the table you're sitting at</p>
                    <div className="flex gap-2">
                      <input
                        className="input flex-1"
                        placeholder='e.g. "Table 12" or "Patio 3"'
                        value={newTableLabel}
                        onChange={(e) => setNewTableLabel(e.target.value)}
                      />
                      <input
                        type="number"
                        min={1}
                        className="input !w-20"
                        placeholder="Seats"
                        value={newTableSeats}
                        onChange={(e) => setNewTableSeats(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button type="button" onClick={() => setAddingTable(false)} className="btn-ghost !py-2 text-sm">Cancel</button>
                      <button type="button" onClick={createTable} disabled={creatingTable} className="btn-primary !py-2 text-sm flex-1">
                        {creatingTable ? 'Adding...' : 'Add & Select Table'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => setAddingTable(true)} className="mt-3 text-sm font-semibold text-gold-dark hover:underline">
                    Can't find your table? Add it
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {orderType === 'delivery' && (
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2"><MapPin size={18} /> Delivery Address</h3>
            <textarea name="address" className="input" rows={2} placeholder="e.g. KG 11 Ave, Kimihurura, Kigali" value={form.address} onChange={handleChange} />
          </div>
        )}

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
              <p className="text-sm text-espresso-400 italic">No payment methods are enabled yet. Ask an admin to enable one in Settings.</p>
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
                After you've paid, you'll be able to upload a screenshot or photo as proof of payment on the next screen.
              </p>
              <label className="flex items-center gap-2 mt-3 text-sm font-semibold text-espresso-800">
                <input type="checkbox" className="accent-espresso-800 w-4 h-4" checked={callConfirmed} onChange={(e) => setCallConfirmed(e.target.checked)} />
                I confirm I have sent / will send the payment for this order
              </label>
            </div>
          )}
        </div>

        <div className="card p-6 space-y-2">
          <div className="flex items-center justify-between text-espresso-600">
            <span>Subtotal</span><span>{formatRWF(total)}</span>
          </div>
          {orderType === 'delivery' && (
            <div className="flex items-center justify-between text-espresso-600">
              <span>Shipping fee</span><span>{formatRWF(shippingFee)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-espresso-100">
            <span className="font-bold text-espresso-900">Order Total</span>
            <span className="text-2xl font-extrabold text-espresso-900">{formatRWF(grandTotal)}</span>
          </div>
        </div>

        <button disabled={placing} className="btn-primary w-full !py-3.5 text-base">
          {placing ? 'Placing order...' : 'Place Order'} <ArrowRight size={18} />
        </button>
        <p className="text-xs text-espresso-400 text-center -mt-4">No account needed. You'll get an order ID to track it.</p>
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
      await api.post(`/orders/track/${order.orderCode}/proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
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
      <h1 className="section-title">Successfully order placed!</h1>
      <p className="text-espresso-500 mt-2">Order ID: <span className="font-mono font-bold">{order.orderCode}</span></p>
      <p className="text-espresso-400 text-sm mt-1">Save this ID. You'll use it to track your order, no account needed.</p>

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
          <button onClick={onDone} className="btn-ghost w-full mt-2 text-sm">I'll do this later, track my order</button>
        </div>
      ) : (
        <button onClick={onDone} className="btn-primary mt-8">See My Order</button>
      )}
    </div>
  )
}
