import { useEffect, useState } from 'react'
import api from '../api/axios'
import DrinkCard from '../components/DrinkCard'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'

const CATEGORY_SETS = {
  coffee: ['Hot Drinks', 'Cold Drinks', 'Specialty'],
  food: ['Pastries', 'Sandwiches'],
}

const COPY = {
  coffee: {
    eyebrow: 'Made fresh, daily',
    title: 'Coffee Menu',
    desc: 'Barista-crafted drinks served right here at the Lab, or ordered ahead for pickup.',
  },
  food: {
    eyebrow: 'Baked & prepared fresh',
    title: 'Food Menu',
    desc: 'Pastries, sandwiches and snacks to go with your cup.',
  },
}

// Powers both the Coffee and Food tabs - same component, different `type`.
// Both eat/drink in-shop (dine-in) or ordered ahead for pickup; the backend
// never allows these to be delivered (see orderStages.js).
export default function MenuCategory({ type }) {
  const categories = CATEGORY_SETS[type]
  const copy = COPY[type]
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { setCategory(''); setPage(1) }, [type])
  useEffect(() => { setPage(1) }, [category])

  useEffect(() => {
    setLoading(true)
    const params = { type, page, limit: 8 }
    if (category) params.category = category
    api.get('/menu', { params }).then((r) => setItems(r.data)).finally(() => setLoading(false))
  }, [type, category, page])

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <span className="text-gold-dark font-bold text-sm uppercase tracking-wider">{copy.eyebrow}</span>
        <h1 className="section-title">{copy.title}</h1>
        <p className="text-espresso-500 mt-2 max-w-2xl">{copy.desc}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory('')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${!category ? 'bg-espresso-900 text-cream-light' : 'bg-espresso-100 text-espresso-700 hover:bg-espresso-200'}`}
        >
          All
        </button>
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

      {loading ? <Loader /> : items.items.length === 0 ? (
        <div className="text-center py-20 text-espresso-400">Nothing in this category yet.</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            {items.items.map((d) => <DrinkCard key={d._id} drink={d} />)}
          </div>
          <Pagination page={items.page} pages={items.pages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
