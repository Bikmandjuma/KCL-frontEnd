import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowRight, Users, Clock, Award } from 'lucide-react'
import api from '../api/axios'
import DrinkCard from '../components/DrinkCard'
import Loader from '../components/Loader'
import { useSettings } from '../context/SettingsContext'

const categories = ['Hot Drinks', 'Cold Drinks', 'Specialty']

export default function Services() {
  const { settings } = useSettings()
  const [drinks, setDrinks] = useState([])
  const [category, setCategory] = useState('Hot Drinks')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get('/drinks', { params: { category } }).then((r) => setDrinks(r.data)).finally(() => setLoading(false))
  }, [category])

  useEffect(() => {
    api.get('/barista/active-session').then((r) => setSession(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      <section className="bg-coffee-gradient text-cream-light py-16">
        <div className="container-app text-center max-w-2xl mx-auto">
          <span className="badge bg-gold/20 text-gold border border-gold/30 mb-4">Our Services</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold">Drinks &amp; Barista Training</h1>
          <p className="mt-4 text-cream-light/80 text-lg">
            Sip something great, then learn how it's made.
          </p>
        </div>
      </section>

      {/* DRINKS */}
      <section className="container-app py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-gold-dark font-bold text-sm uppercase tracking-wider">Made fresh, daily</span>
            <h2 className="section-title">Kigali Coffee Lab Menu</h2>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input !w-52"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? <Loader /> : drinks.length === 0 ? (
          <div className="text-center py-16 text-espresso-400">No drinks in this category yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {drinks.map((d) => <DrinkCard key={d._id} drink={d} />)}
          </div>
        )}
      </section>

      {/* BARISTA TRAINING */}
      <section id="barista" className="bg-espresso-50 py-16 scroll-mt-20">
        <div className="container-app">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="badge bg-espresso-900 text-cream-light mb-4">Barista Training</span>
              <h2 className="section-title">Become a Barista at Kigali Coffee Lab</h2>
              <p className="mt-4 text-espresso-600 leading-relaxed">
                Our hands-on program covers everything: grinding and dosing, extraction theory,
                milk steaming, latte art, and running a coffee bar from open to close. Perfect
                whether you're equipping your own kitchen, opening a cafe, or starting a new career.
              </p>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="card p-4 text-center">
                  <Clock className="mx-auto text-gold-dark mb-1" size={22} />
                  <p className="text-xs text-espresso-500 font-semibold">8 Weeks</p>
                </div>
                <div className="card p-4 text-center">
                  <Users className="mx-auto text-gold-dark mb-1" size={22} />
                  <p className="text-xs text-espresso-500 font-semibold">Small Groups</p>
                </div>
                <div className="card p-4 text-center">
                  <Award className="mx-auto text-gold-dark mb-1" size={22} />
                  <p className="text-xs text-espresso-500 font-semibold">Certificate</p>
                </div>
              </div>

              {session ? (
                <div className="mt-6 p-4 rounded-xl bg-white border border-espresso-100">
                  <p className="font-bold text-espresso-900">{session.title}</p>
                  <p className="text-sm text-espresso-500 mt-1">{session.description}</p>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-xl bg-white border border-espresso-100 text-sm text-espresso-500">
                  There is no open training session right now. Check back soon.
                </div>
              )}

              <Link to="/barista/apply" className="btn-primary mt-6 inline-flex">
                Apply for Training <ArrowRight size={18} />
              </Link>
            </div>

            <div className="rounded-[2.5rem] bg-coffee-gradient aspect-square flex items-center justify-center">
              <GraduationCap size={120} className="text-gold" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
