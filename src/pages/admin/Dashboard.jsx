import { useEffect, useState } from 'react'
import { Eye, ShoppingBag, XCircle, CheckCircle2, Users, Package, Wallet } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import api, { fileUrl } from '../../api/axios'
import Loader from '../../components/Loader'
import StatCard from '../../components/admin/StatCard'
import RangeTabs from '../../components/admin/RangeTabs'
import { formatRWF } from '../../utils/format'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [range, setRange] = useState('monthly')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard').then((r) => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading dashboard..." />
  if (!stats) return null

  const trendData = stats.trend.map((t) => ({ date: t._id.slice(5), orders: t.count }))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-espresso-500 text-sm mt-1">A snapshot of Kigali Coffee Lab's performance.</p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Eye} label={`Visits (${range})`} value={stats.visits[range]} accent="bg-espresso-900" />
        <StatCard icon={ShoppingBag} label={`Orders (${range})`} value={stats.orders[range]} accent="bg-gold-dark" />
        <StatCard icon={XCircle} label={`Cancelled (${range})`} value={stats.cancelled[range]} accent="bg-red-600" />
        <StatCard icon={CheckCircle2} label={`Delivered (${range})`} value={stats.delivered[range]} accent="bg-green-700" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Clients" value={stats.totalUsers} accent="bg-espresso-700" />
        <StatCard icon={Package} label="Machines Listed" value={stats.totalProducts} accent="bg-espresso-700" />
        <StatCard icon={Wallet} label="Total Revenue" value={formatRWF(stats.totalRevenue)} accent="bg-espresso-700" />
        <StatCard icon={ShoppingBag} label="All-time Orders" value={stats.totalDrinksOrders} accent="bg-espresso-700" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-display font-bold text-lg mb-4">Orders in the last 14 days</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecdfd3" />
              <XAxis dataKey="date" stroke="#8a5c3a" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#8a5c3a" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ecdfd3' }} />
              <Line type="monotone" dataKey="orders" stroke="#4a2c1d" strokeWidth={3} dot={{ fill: '#c9a66b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Top Machines by Sales</h3>
          <div className="space-y-3">
            {stats.topProducts.map((p) => (
              <div key={p._id} className="flex items-center gap-3">
                <img src={fileUrl(p.image)} className="w-10 h-10 rounded-lg object-cover bg-espresso-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-espresso-800 truncate">{p.title}</p>
                  <p className="text-xs text-espresso-400">{p.sold || 0} sold</p>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && <p className="text-sm text-espresso-400">No sales yet.</p>}
          </div>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h3 className="font-display font-bold text-lg mb-4">Orders by Range Comparison</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={[
            { name: 'Daily', value: stats.orders.daily },
            { name: 'Weekly', value: stats.orders.weekly },
            { name: 'Monthly', value: stats.orders.monthly },
            { name: 'Yearly', value: stats.orders.yearly },
            { name: 'Lifetime', value: stats.orders.lifetime },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ecdfd3" />
            <XAxis dataKey="name" stroke="#8a5c3a" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#8a5c3a" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ecdfd3' }} />
            <Bar dataKey="value" fill="#c9a66b" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
