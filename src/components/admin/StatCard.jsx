export default function StatCard({ icon: Icon, label, value, accent = 'bg-espresso-900' }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <span className={`w-12 h-12 rounded-xl ${accent} text-cream-light flex items-center justify-center shrink-0`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-espresso-400 text-xs font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-xl font-extrabold text-espresso-900 truncate">{value}</p>
      </div>
    </div>
  )
}
