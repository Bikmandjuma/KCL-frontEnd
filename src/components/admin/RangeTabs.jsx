const ranges = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'lifetime', label: 'Lifetime' },
]

export default function RangeTabs({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((r) => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${value === r.id ? 'bg-espresso-900 text-cream-light' : 'bg-espresso-100 text-espresso-700 hover:bg-espresso-200'}`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
