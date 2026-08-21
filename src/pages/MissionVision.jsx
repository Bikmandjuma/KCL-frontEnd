import { Target, Eye, Heart, Leaf } from 'lucide-react'

export default function MissionVision() {
  return (
    <div>
      <section className="bg-coffee-gradient text-cream-light py-16">
        <div className="container-app text-center max-w-2xl mx-auto">
          <span className="badge bg-gold/20 text-gold border border-gold/30 mb-4">Who We Are</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold">Mission &amp; Vision</h1>
        </div>
      </section>

      <section className="container-app py-16 grid md:grid-cols-2 gap-8">
        <div className="card p-8">
          <span className="w-14 h-14 rounded-full bg-espresso-900 text-gold flex items-center justify-center mb-5">
            <Target size={26} />
          </span>
          <h2 className="font-display text-2xl font-bold text-espresso-900">Our Mission</h2>
          <p className="text-espresso-600 leading-relaxed mt-3">
            To equip every home and cafe in Rwanda with quality coffee machines, while training
            a new generation of skilled baristas who can turn great beans into unforgettable cups.
          </p>
        </div>
        <div className="card p-8">
          <span className="w-14 h-14 rounded-full bg-espresso-900 text-gold flex items-center justify-center mb-5">
            <Eye size={26} />
          </span>
          <h2 className="font-display text-2xl font-bold text-espresso-900">Our Vision</h2>
          <p className="text-espresso-600 leading-relaxed mt-3">
            To become East Africa's most trusted coffee lab, known for genuine equipment,
            barista excellence, and a community that treats every cup as a craft.
          </p>
        </div>
      </section>

      <section className="bg-espresso-50 py-16">
        <div className="container-app grid sm:grid-cols-2 gap-6">
          <div className="card p-6 flex gap-4">
            <Heart className="text-gold-dark shrink-0" size={26} />
            <div>
              <h3 className="font-bold text-espresso-900">Craft over shortcuts</h3>
              <p className="text-sm text-espresso-500 mt-1">Every machine we sell and every drink we teach is about doing it right.</p>
            </div>
          </div>
          <div className="card p-6 flex gap-4">
            <Leaf className="text-gold-dark shrink-0" size={26} />
            <div>
              <h3 className="font-bold text-espresso-900">Community first</h3>
              <p className="text-sm text-espresso-500 mt-1">We grow by growing the people around us, one trained barista at a time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
