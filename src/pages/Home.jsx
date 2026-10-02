import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Coffee, Truck, ShieldCheck, GraduationCap, UtensilsCrossed, Cpu } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import DrinkCard from '../components/DrinkCard'
import Loader from '../components/Loader'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [coffee, setCoffee] = useState([])
  const [loadingCoffee, setLoadingCoffee] = useState(true)

  const [food, setFood] = useState([])
  const [loadingFood, setLoadingFood] = useState(true)

  useEffect(() => {
    api.get('/products', { params: { limit: 12 } }).then((r) => setProducts(r.data.items || [])).finally(() => setLoadingProducts(false))
    api.get('/menu', { params: { type: 'coffee', page: 1, limit: 12 } }).then((r) => setCoffee(r.data.items || [])).finally(() => setLoadingCoffee(false))
    api.get('/menu', { params: { type: 'food', page: 1, limit: 12 } }).then((r) => setFood(r.data.items || [])).finally(() => setLoadingFood(false))
  }, [])

  return (
    <div className='bg-gray-200'>

      {/* COFFEE PREVIEW */}
      <section className="container-app py-16 bg-gray-200">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 -m-2">
          <div>
            <span className="text-gold-dark font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Coffee size={16} /> Right here, right now</span>
            <h2 className="section-title">Coffee Menu</h2>
          </div>
          <Link to="/coffee" className="btn-gold whitespace-nowrap">Full menu <ArrowRight size={16} /></Link>
        </div>
        {loadingCoffee ? <Loader /> : coffee.length === 0 ? (
          <p className="text-espresso-400">No drinks in the menu yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coffee.map((d) => <DrinkCard key={d._id} drink={d} />)}
          </div>
        )}
      </section>

      {/* FOOD PREVIEW - a soft tint, not a heavy dark block, keeps the page feeling light */}
      <section className="container-app py-16 bg-gold/5 rounded-[2.5rem] bg-gray-200">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-gold-dark font-bold text-sm uppercase tracking-wider flex items-center gap-2"><UtensilsCrossed size={16} /> Baked &amp; prepared fresh</span>
            <h2 className="section-title">Food Menu</h2>
          </div>
          <Link to="/food" className="btn-gold whitespace-nowrap">Full menu <ArrowRight size={16} /></Link>
        </div>
        {loadingFood ? <Loader /> : food.length === 0 ? (
          <p className="text-espresso-400">No food items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {food.map((d) => <DrinkCard key={d._id} drink={d} />)}
          </div>
        )}
      </section>

      {/* MACHINES PREVIEW */}
      <section className="container-app py-16 bg-gray-200">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-gold-dark font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Cpu size={16} /> Fresh in store</span>
            <h2 className="section-title">Featured Coffee Machines</h2>
          </div>
          <Link to="/shop" className="btn-outline whitespace-nowrap">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {loadingProducts ? <Loader /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

    </div>
  )
}
