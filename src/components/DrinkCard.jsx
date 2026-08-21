import { fileUrl } from '../api/axios'
import { formatRWF } from '../utils/format'
import { Coffee } from 'lucide-react'

export default function DrinkCard({ drink }) {
  return (
    <div className="card overflow-hidden flex hover:-translate-y-1 transition-transform duration-300">
      <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-espresso-50 overflow-hidden">
        {drink.image ? (
          <img src={fileUrl(drink.image)} alt={drink.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-espresso-300">
            <Coffee size={32} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-center flex-1">
        <h4 className="font-display font-bold text-espresso-900">{drink.name}</h4>
        {drink.desc && <p className="text-sm text-espresso-500 line-clamp-2 mt-0.5">{drink.desc}</p>}
        <span className="mt-2 font-extrabold text-gold-dark">{formatRWF(drink.price)}</span>
      </div>
    </div>
  )
}
