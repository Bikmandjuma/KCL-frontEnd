import { useEffect, useRef, useState, useCallback } from 'react'
import { Search, Bell, XCircle, Clock, Upload, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import api, { fileUrl } from '../api/axios'
import { formatDateTime } from '../utils/format'

const ORDER_TYPE_LABELS = { dine_in: 'Dine-in', pickup: 'Pickup order', delivery: 'Delivery' }

const STAGES = {
  dine_in: ['Order Placed', 'Preparing', 'Ready for Pickup', 'Served'],
  pickup: ['Order Placed', 'Preparing', 'Ready for Pickup', 'Served'],
  delivery: ['Order Placed', 'Pending', 'Confirmed', 'Dispatched', 'Delivered'],
}

const LAST_CODE_KEY = 'kcl_last_order_code'

// Live MM:SS countdown from etaSetAt + etaMinutes, ticking every second on
// the client - staff only set the ETA once, the customer's screen does the
// rest without any extra network traffic.
function EtaCountdown({ etaSetAt, etaMinutes }) {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const targetMs = new Date(etaSetAt).getTime() + etaMinutes * 60000
    const tick = () => setRemaining(Math.max(0, Math.round((targetMs - Date.now()) / 1000)))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [etaSetAt, etaMinutes])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <div className="mt-3 p-4 rounded-xl bg-gold/10 border border-gold/30 flex items-center gap-3">
      <Clock size={22} className="text-gold-dark" />
      <div>
        <p className="text-xs text-espresso-500 font-semibold">
          {remaining > 0 ? 'Ready in about' : 'Should be ready any moment'}
        </p>
        {remaining > 0 && <p className="font-mono font-extrabold text-2xl text-espresso-900">{mm}:{ss}</p>}
      </div>
    </div>
  )
}

export default function TrackOrder() {
  const [code, setCode] = useState(() => localStorage.getItem(LAST_CODE_KEY) || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadingProof, setUploadingProof] = useState(false)
  const trackedCode = useRef(null)

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  const load = useCallback(async (searchCode, { silent = false } = {}) => {
    const trimmed = (searchCode || '').trim()
    if (!trimmed) return
    if (!silent) setLoading(true)
    setError(null)
    try {
      const { data } = await api.get(`/orders/track/${trimmed}`)
      setOrder(data)
      trackedCode.current = trimmed
      localStorage.setItem(LAST_CODE_KEY, trimmed)
    } catch (e) {
      setOrder(null)
      setError(e.response?.data?.msg || 'Order not found')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadNotifications = useCallback(async (searchCode) => {
    if (!searchCode) return
    try {
      const { data } = await api.get(`/notifications/${searchCode}`)
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch { /* silent */ }
  }, [])

  useEffect(() => { if (code) { load(code); loadNotifications(code) } }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!trackedCode.current) return
    const interval = setInterval(() => {
      load(trackedCode.current, { silent: true })
      loadNotifications(trackedCode.current)
    }, 6000)
    return () => clearInterval(interval)
  }, [order, load, loadNotifications])

  const toggleNotifications = async () => {
    setShowNotifications((v) => !v)
    if (!showNotifications && unreadCount > 0 && trackedCode.current) {
      try {
        await api.put(`/notifications/${trackedCode.current}/read-all`)
        setUnreadCount(0)
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      } catch { /* silent */ }
    }
  }

  const cancelOrder = async () => {
    if (!trackedCode.current) return
    try {
      await api.put(`/orders/track/${trackedCode.current}/cancel`)
      toast.success('Order cancelled')
      load(trackedCode.current)
    } catch (e) {
      toast.error(e.response?.data?.msg || 'Could not cancel this order')
    }
  }

  const uploadProof = async (file) => {
    if (!file || !trackedCode.current) return
    setUploadingProof(true)
    try {
      const fd = new FormData()
      fd.append('proof', file)
      await api.post(`/orders/track/${trackedCode.current}/proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Proof of payment uploaded. We will confirm shortly.')
      load(trackedCode.current)
    } catch (e) {
      toast.error(e.response?.data?.msg || 'Upload failed, please try again')
    } finally {
      setUploadingProof(false)
    }
  }

  const needsProof = order && ['MoMo Pay', 'MoMo Code'].includes(order.paymentMethod)

  const steps = order ? STAGES[order.orderType] || [] : []
  const doneIndex = order && order.orderStatus !== 'Cancelled' ? steps.indexOf(order.orderStatus) : -1
  const showCountdown = order?.orderStatus === 'Preparing' && order?.etaMinutes && order?.etaSetAt

  return (
    <div className="container-app py-10 max-w-2xl">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="section-title">Track Order</h1>
        {trackedCode.current && (
          <div className="relative">
            <button onClick={toggleNotifications} className="relative w-11 h-11 rounded-full bg-espresso-100 flex items-center justify-center text-espresso-700 hover:bg-espresso-200 transition" aria-label="Notifications">
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white rounded-xl shadow-soft border border-espresso-100 z-20 animate-fadeUp">
                {notifications.length === 0 ? (
                  <p className="text-center text-espresso-400 text-sm py-8 px-4">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-espresso-50 last:border-0">
                      <p className="text-sm font-semibold text-espresso-900">{n.title}</p>
                      <p className="text-xs text-espresso-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-espresso-300 mt-1">{formatDateTime(n.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-espresso-500 mb-8">
        Enter the order ID you got at checkout (e.g. KCL-482131) to see its status. No account needed.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); load(code); loadNotifications(code) }} className="flex gap-3 mb-8">
        <input
          className="input flex-1 font-mono"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="KCL-XXXXXXXX"
          autoCapitalize="characters"
        />
        <button className="btn-primary !px-5" disabled={loading}>
          <Search size={18} /> {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="card p-4 border-red-200 bg-red-50 text-red-700 mb-6">{error}</div>
      )}

      {order && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-extrabold text-xl text-espresso-900">{order.orderCode}</h2>
          </div>
          {order.table && <p className="text-sm text-espresso-500">{order.table.label}</p>}
          <p className="text-sm text-espresso-500 mb-2">
            {ORDER_TYPE_LABELS[order.orderType] || order.orderType} · Paying by {order.paymentMethod}
          </p>

          {showCountdown && <EtaCountdown etaSetAt={order.etaSetAt} etaMinutes={order.etaMinutes} />}

          {order.orderStatus === 'Cancelled' ? (
            <p className="text-red-600 font-bold text-center py-6">This order was cancelled.</p>
          ) : (
            <div className="space-y-0 mt-6">
              {steps.map((label, index) => {
                const done = index <= doneIndex
                const isLast = index === steps.length - 1
                return (
                  <div key={label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-espresso-900 text-cream-light' : 'bg-espresso-100 text-espresso-400'}`}>
                        {done ? '✓' : index + 1}
                      </div>
                      {!isLast && <div className={`w-0.5 flex-1 min-h-[28px] ${done ? 'bg-espresso-900' : 'bg-espresso-100'}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`font-semibold ${done ? 'text-espresso-900' : 'text-espresso-400'}`}>{label}</p>
                      <p className="text-xs text-espresso-400">
                        {index === 0 ? formatDateTime(order.createdAt) : done ? formatDateTime(order.updatedAt) : '--'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {needsProof && order.orderStatus !== 'Cancelled' && (
            order.proofOfPayment ? (
              <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <ImageIcon size={18} className="text-green-700 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-green-800">Proof of payment uploaded</p>
                  <a href={fileUrl(order.proofOfPayment)} target="_blank" rel="noreferrer" className="text-xs text-green-700 underline">View it</a>
                </div>
              </div>
            ) : (
              <label className="mt-4 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gold/40 bg-gold/5 cursor-pointer text-sm font-semibold text-espresso-700 hover:bg-gold/10 transition">
                {uploadingProof ? 'Uploading...' : <><Upload size={16} /> Upload proof of payment</>}
                <input type="file" accept="image/*" className="hidden" disabled={uploadingProof} onChange={(e) => uploadProof(e.target.files[0])} />
              </label>
            )
          )}

          {order.orderStatus === 'Order Placed' && (
            <button onClick={cancelOrder} className="btn-ghost !text-red-600 mt-2">
              <XCircle size={16} /> Cancel this order
            </button>
          )}
        </div>
      )}

      {!order && !error && !loading && (
        <div className="text-center py-16 text-espresso-400">
          Your order status will show up here.
        </div>
      )}
    </div>
  )
}
