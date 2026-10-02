import { useEffect, useState } from 'react'
import { Eye, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import api, { fileUrl } from '../../api/axios'
import Loader from '../../components/Loader'
import Modal from '../../components/admin/Modal'
import Pagination from '../../components/Pagination'
import { formatRWF, formatDate } from '../../utils/format'

// Coffee/food orders (dine-in or pickup) go through a prep-focused flow;
// machine orders (always `delivery`) go through a shipping-focused one -
// see backend/utils/orderStages.js, which this mirrors exactly.
const STAGE_SETS = {
  dine_in: ['Order Placed', 'Preparing', 'Ready for Pickup', 'Served'],
  pickup: ['Order Placed', 'Preparing', 'Ready for Pickup', 'Served'],
  delivery: ['Order Placed', 'Pending', 'Confirmed', 'Dispatched', 'Delivered'],
}
const ALL_STATUSES = ['Order Placed', 'Preparing', 'Ready for Pickup', 'Served', 'Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled']
const statusColors = {
  'Order Placed': 'bg-espresso-100 text-espresso-700',
  'Preparing': 'bg-yellow-100 text-yellow-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Ready for Pickup': 'bg-blue-100 text-blue-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Dispatched': 'bg-purple-100 text-purple-800',
  'Served': 'bg-green-100 text-green-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
}
const ORDER_TYPE_LABELS = { dine_in: 'Dine-in', pickup: 'Pickup', delivery: 'Delivery' }

export default function AdminOrders() {
  const [orders, setOrders] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewOrder, setViewOrder] = useState(null)

  // { orderId, status } while the "how many minutes until ready?" prompt is open
  const [etaPrompt, setEtaPrompt] = useState(null)
  const [etaValue, setEtaValue] = useState('15')

  const load = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (filter) params.status = filter
      if (search) params.search = search
      const { data } = await api.get('/orders', { params })
      setOrders(data)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [filter, search, page])
  useEffect(() => { setPage(1) }, [filter, search])

  const applyStatus = async (id, status, etaMinutes) => {
    try {
      const body = { status }
      if (etaMinutes) body.etaMinutes = Number(etaMinutes)
      const { data } = await api.put(`/orders/${id}`, body)
      toast.success('Order status updated')
      load()
      if (viewOrder?._id === id) setViewOrder((o) => ({ ...o, ...data }))
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not update order')
    }
  }

  const updateStatus = (order, status) => {
    // Moving to "Preparing" needs an ETA so the customer's tracking screen
    // can show a live countdown - ask for it before applying the change.
    if (status === 'Preparing') {
      setEtaValue('15')
      setEtaPrompt({ orderId: order._id, status })
      return
    }
    applyStatus(order._id, status)
  }

  const confirmEtaPrompt = () => {
    if (!etaPrompt) return
    const minutes = Number(etaValue)
    if (!minutes || minutes <= 0) return toast.error('Enter how many minutes until this order is ready')
    applyStatus(etaPrompt.orderId, etaPrompt.status, minutes)
    setEtaPrompt(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Orders</h1>
          <p className="text-espresso-500 text-sm mt-1">Track, confirm and manage customer orders.</p>
        </div>
      </div>

      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" />
          <input className="input !pl-10" placeholder="Search by order id, contact or name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input sm:!w-56" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-espresso-50 text-espresso-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Order</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.items.map((o) => {
                  const allowed = STAGE_SETS[o.orderType] || ALL_STATUSES
                  const options = allowed.includes(o.orderStatus) ? allowed : [...allowed, o.orderStatus]
                  return (
                    <tr key={o._id} className="border-t border-espresso-100 hover:bg-espresso-50/50">
                      <td className="px-4 py-3 font-mono text-xs">{o.orderCode}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-espresso-800">{o.customerName || o.orderby?.username || 'Guest'}</p>
                        <p className="text-xs text-espresso-400">{o.contact}</p>
                      </td>
                      <td className="px-4 py-3 text-espresso-600">
                        {ORDER_TYPE_LABELS[o.orderType] || o.orderType}
                        {o.table && <span className="block text-xs text-espresso-400">{o.table.label}</span>}
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatRWF(o.paymentIntent?.amount)}</td>
                      <td className="px-4 py-3 text-espresso-500">{o.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => updateStatus(o, e.target.value)}
                          className={`badge border-0 outline-none cursor-pointer ${statusColors[o.orderStatus] || ''}`}
                        >
                          {[...options, 'Cancelled'].filter((s, i, arr) => arr.indexOf(s) === i).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-espresso-400">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setViewOrder(o)} className="p-2 rounded-lg hover:bg-espresso-100 text-espresso-500"><Eye size={16} /></button>
                      </td>
                    </tr>
                  )
                })}
                {orders.items.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-espresso-400">No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={orders.page} pages={orders.pages} onChange={setPage} />
        </>
      )}

      <Modal open={!!etaPrompt} onClose={() => setEtaPrompt(null)} title="How long until it's ready?">
        <p className="text-sm text-espresso-500 mb-4">
          The customer's tracking screen will show a live countdown from this.
        </p>
        <label className="label">Minutes</label>
        <input
          type="number"
          min={1}
          className="input"
          value={etaValue}
          onChange={(e) => setEtaValue(e.target.value)}
          autoFocus
        />
        <button onClick={confirmEtaPrompt} className="btn-primary w-full mt-4">Set &amp; Start Preparing</button>
      </Modal>

      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title="Order Details" wide>
        {viewOrder && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <p><span className="font-semibold text-espresso-700">Customer:</span> {viewOrder.customerName || viewOrder.orderby?.username || 'Guest'}</p>
              <p><span className="font-semibold text-espresso-700">Contact:</span> {viewOrder.contact}</p>
              <p><span className="font-semibold text-espresso-700">Order type:</span> {ORDER_TYPE_LABELS[viewOrder.orderType] || viewOrder.orderType}</p>
              {viewOrder.table && <p><span className="font-semibold text-espresso-700">Table:</span> {viewOrder.table.label}</p>}
              {viewOrder.address && <p><span className="font-semibold text-espresso-700">Address:</span> {viewOrder.address}</p>}
              <p><span className="font-semibold text-espresso-700">Payment Method:</span> {viewOrder.paymentMethod}</p>
              <p><span className="font-semibold text-espresso-700">Call Confirmed:</span> {viewOrder.callConfirmed ? 'Yes' : 'No'}</p>
              {viewOrder.etaMinutes && (
                <p><span className="font-semibold text-espresso-700">ETA set:</span> {viewOrder.etaMinutes} min at {formatDate(viewOrder.etaSetAt)}</p>
              )}
            </div>
            {viewOrder.notes && <p className="text-sm"><span className="font-semibold text-espresso-700">Notes:</span> {viewOrder.notes}</p>}

            <div>
              <p className="font-semibold text-espresso-700 mb-2 text-sm">Items</p>
              <div className="space-y-2">
                {viewOrder.products?.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm bg-espresso-50 rounded-xl p-2">
                    <img src={fileUrl(p.image)} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="flex-1">{p.title}</span>
                    <span>x{p.quantity}</span>
                    <span className="font-semibold">{formatRWF(p.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {viewOrder.proofOfPayment ? (
              <div>
                <p className="font-semibold text-espresso-700 mb-2 text-sm">Proof of Payment</p>
                <img src={fileUrl(viewOrder.proofOfPayment)} className="rounded-xl max-h-72 border border-espresso-100" />
              </div>
            ) : (
              <p className="text-sm text-espresso-400 italic">No proof of payment uploaded yet.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
