import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Coffee, Truck, ShieldCheck, GraduationCap, Star } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import DrinkCard from '../components/DrinkCard'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import CategoryDropdown from '../components/CategoryDropdown'

const drinkCategories = ['Hot Drinks', 'Cold Drinks', 'Specialty']

export default function Home() {
  const [products, setProducts] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [drinks, setDrinks] = useState([])
  const [drinkCategory, setDrinkCategory] = useState('Hot Drinks')
  const [loadingDrinks, setLoadingDrinks] = useState(true)

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoadingProducts(true)
    const params = { page, limit: 12 }
    if (category) params.category = category
    api.get('/products', { params }).then((r) => setProducts(r.data)).finally(() => setLoadingProducts(false))
  }, [page, category])

  useEffect(() => {
    setLoadingDrinks(true)
    api.get('/drinks', { params: { category: drinkCategory } })
      .then((r) => setDrinks(r.data.slice(0, 4)))
      .finally(() => setLoadingDrinks(false))
  }, [drinkCategory])

  return (
    <div>
      {/* HERO - background image, with the coffee-gradient kept only on the
          decorative "cup" card so the whole section isn't a flat color */}
      <section
        className="relative overflow-hidden text-cream-light bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.svg')" }}
      >
        <div className="absolute inset-0 bg-espresso-950/40" />
        <div className="container-app py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div className="animate-fadeUp">
            <span className="badge bg-gold/20 text-gold border border-gold/30 mb-5">Kigali Coffee Lab</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Premium Coffee Machines, <span className="text-gold">Crafted Cups</span> and Barista Skills
            </h1>
            <p className="mt-5 text-cream-light/80 text-lg max-w-xl">
              From espresso machines to French presses, equip your kitchen or cafe, or stop by
              for a barista-made cup and learn the craft yourself.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-gold">
                Shop Machines <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn-outline !border-cream-light !text-cream-light hover:!bg-cream-light hover:!text-espresso-900">
                View Drinks Menu
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="w-2 h-10 bg-cream-light/40 rounded-full animate-steam" style={{animationDelay:'0s'}}/>
              <span className="w-2 h-14 bg-cream-light/40 rounded-full animate-steam" style={{animationDelay:'.4s'}}/>
              <span className="w-2 h-10 bg-cream-light/40 rounded-full animate-steam" style={{animationDelay:'.8s'}}/>
            </div>
            {/* This decorative card intentionally keeps the coffee gradient */}
            <div className="w-full aspect-square rounded-[3rem] bg-coffee-gradient border border-gold/20 flex items-center justify-center shadow-soft">
              <Coffee size={140} className="text-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-cream-dark border-b border-espresso-100">
        <div className="container-app py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-espresso-800">
          <div className="flex items-center gap-3"><Truck className="text-gold-dark" /> <span className="text-sm font-semibold">Fast local delivery in Kigali</span></div>
          <div className="flex items-center gap-3"><ShieldCheck className="text-gold-dark" /> <span className="text-sm font-semibold">Genuine, quality-checked machines</span></div>
          <div className="flex items-center gap-3"><GraduationCap className="text-gold-dark" /> <span className="text-sm font-semibold">Hands-on barista training</span></div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-app py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-gold-dark font-bold text-sm uppercase tracking-wider">Fresh in store</span>
            <h2 className="section-title">Featured Coffee Machines</h2>
          </div>
          <div className="flex items-center gap-3">
            <CategoryDropdown value={category} onChange={(v) => { setCategory(v); setPage(1) }} options={categories} className="w-44" />
            <Link to="/shop" className="btn-outline whitespace-nowrap">
              View all <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        {loadingProducts ? <Loader /> : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.items.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
            <Pagination page={products.page} pages={products.pages} onChange={setPage} />
          </>
        )}
      </section>

      {/* DRINKS + BARISTA */}
      <section className="bg-espresso-900 text-cream-light py-16">
        <div className="container-app">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-gold font-bold text-sm uppercase tracking-wider">Right here, right now</span>
              <h2 className="section-title !text-cream-light">KCL Hot Drinks Menu</h2>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={drinkCategory}
                onChange={(e) => setDrinkCategory(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 text-cream-light px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-gold"
              >
                {drinkCategories.map((c) => <option key={c} value={c} className="text-espresso-900">{c}</option>)}
              </select>
              <Link to="/services" className="btn-gold whitespace-nowrap">Full menu <ArrowRight size={16} /></Link>
            </div>
          </div>
          {loadingDrinks ? <Loader /> : drinks.length === 0 ? (
            <p className="text-cream-light/60">No drinks in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {drinks.map((d) => <DrinkCard key={d._id} drink={d} />)}
            </div>
          )}

          {/* Barista training teaser */}
          <div className="mt-12 card !bg-white/5 !border-white/10 p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="badge bg-gold/20 text-gold border border-gold/30 mb-3">Learn the craft</span>
              <h3 className="font-display text-2xl font-bold text-cream-light">Become a Barista at Kigali Coffee Lab</h3>
              <p className="text-cream-light/70 mt-3 leading-relaxed">
                Grinding, dosing, extraction, milk steaming and latte art. Our hands-on program
                turns first-timers into confident baristas, session by session.
              </p>
              <Link to="/services#barista" className="btn-gold mt-5 inline-flex">
                Apply for Training <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-2xl bg-coffee-gradient aspect-video flex items-center justify-center">
              <GraduationCap size={72} className="text-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* BARISTA CTA / REVIEW */}
      <section className="container-app py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="card p-8 md:p-10 order-2 md:order-1">
          <div className="flex gap-1 text-gold mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
          </div>
          <p className="text-espresso-700 italic text-lg">
            Kigali Coffee Lab didn't just sell me a machine. They taught me how to pull the
            perfect shot. Now I run my own little cafe corner.
          </p>
          <p className="mt-4 font-bold text-espresso-900">A Happy KCL Graduate</p>
        </div>
        <div className="order-1 md:order-2">
          <span className="text-gold-dark font-bold text-sm uppercase tracking-wider">About the lab</span>
          <h2 className="section-title mt-1">More Than a Coffee Shop</h2>
          <p className="mt-4 text-espresso-600 leading-relaxed">
            Beyond selling coffee machines, KCL trains aspiring baristas, from pulling
            espresso shots and steaming milk to latte art and running a coffee bar. Whether
            you're buying your first French press or dreaming of your own cafe, we've got you.
          </p>
          <Link to="/about" className="btn-primary mt-6 inline-flex">
            Learn about our story <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
