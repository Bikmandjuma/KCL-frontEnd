import { ChevronDown } from 'lucide-react'

export default function CategoryDropdown({ value, onChange, options, allLabel = 'All categories', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input !pr-9 appearance-none cursor-pointer"
      >
        <option value="">{allLabel}</option>
        {options.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 pointer-events-none" />
    </div>
  )
}
