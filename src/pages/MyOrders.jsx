import { useEffect, useState } from 'react'
import { Package, Upload, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api, { fileUrl } from '../api/axios'
import { formatRWF, formatDate } from '../utils/format'
import Loader from '../components/Loader'

// This storefront only creates machine orders, which the backend always
// treats as `orderType: 'delivery'` - see backend/utils/orderStages.js.
const statusColors = {
  'Order Placed': 'bg-espresso-100 text-espresso-700',
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Dispatched': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
}

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/orders/user-orders')
      setOrders(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const cancelOrder = async (id) => {
    if (!confirm('Cancel this order?')) return
    try {
      await api.put(`/orders/${id}/cancel`)
      toast.success('Order cancelled')
      load()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not cancel order')
    }
  }

  const uploadProof = async (id, file) => {
    if (!file) return
    try {
      const fd = new FormData()
      fd.append('proof', file)
      await api.post(`/orders/${id}/proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Proof uploaded!')
      load()
    } catch {
      toast.error('Upload failed')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="container-app py-10">
      <h1 className="section-title mb-8 flex items-center gap-2"><Package /> My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-espresso-400">You haven't placed any orders yet.</div>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => (
            <div key={o._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-espresso-400 flex items-center gap-1"><Clock size={12}/> {formatDate(o.createdAt)}</p>
                  <p className="font-mono text-sm text-espresso-500">#{o.orderCode}</p>
                </div>
                <span className={`badge ${statusColors[o.orderStatus] || 'bg-espresso-100 text-espresso-700'}`}>{o.orderStatus}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {o.products?.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={fileUrl(p.image || p.productId?.image)} className="w-12 h-12 rounded-lg object-cover bg-espresso-50" />
                    <div>
                      <p className="font-semibold text-espresso-800">{p.title || p.productId?.title}</p>
                      <p className="text-espresso-400">Qty: {p.quantity} • {formatRWF(p.price || p.productId?.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-espresso-100">
                <p className="font-extrabold text-espresso-900">{formatRWF(o.paymentIntent?.amount)}</p>
                <div className="flex gap-2 items-center">
                  {['MoMo Pay', 'MoMo Code'].includes(o.paymentMethod) && !o.proofOfPayment && !['Delivered', 'Cancelled'].includes(o.orderStatus) && (
                    <label className="btn-outline !py-2 !px-3 text-xs cursor-pointer">
                      <Upload size={14} /> Upload Proof
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadProof(o._id, e.target.files[0])} />
                    </label>
                  )}
                  {o.proofOfPayment && (
                    <a href={fileUrl(o.proofOfPayment)} target="_blank" rel="noreferrer" className="text-xs text-gold-dark font-semibold underline">
                      View uploaded proof
                    </a>
                  )}
                  {o.orderStatus === 'Order Placed' && (
                    <button onClick={() => cancelOrder(o._id)} className="btn-ghost !text-red-600 !py-2 !px-3 text-xs">
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
