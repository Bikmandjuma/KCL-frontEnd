import { useEffect, useState } from 'react'
import api from '../api/axios'
import DrinkCard from '../components/DrinkCard'
import Loader from '../components/Loader'

export default function Menu() {
  const [drinks, setDrinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('Hot Drinks')

  useEffect(() => {
    setLoading(true)
    api.get('/drinks', { params: { category } }).then((r) => setDrinks(r.data)).finally(() => setLoading(false))
  }, [category])

  const categories = ['Hot Drinks', 'Cold Drinks', 'Specialty']

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <span className="text-gold-dark font-bold text-sm uppercase tracking-wider">Made fresh, daily</span>
        <h1 className="section-title">Kigali Coffee Lab Menu</h1>
        <p className="text-espresso-500 mt-2 max-w-2xl">Barista-crafted drinks served right here at the Lab.</p>
      </div>

      <div className="flex gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${category === c ? 'bg-espresso-900 text-cream-light' : 'bg-espresso-100 text-espresso-700 hover:bg-espresso-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : drinks.length === 0 ? (
        <div className="text-center py-20 text-espresso-400">No drinks in this category yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {drinks.map((d) => <DrinkCard key={d._id} drink={d} />)}
        </div>
      )}
    </div>
  )
}
