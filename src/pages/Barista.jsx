import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowRight, Users, Clock, Award } from 'lucide-react'
import api from '../api/axios'

export default function Barista() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    api.get('/barista/active-session').then((r) => setSession(r.data)).catch(() => {})
  }, [])

  return (
    <div>

      <section className="container-app py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
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
      </section>
    </div>
  )
}
