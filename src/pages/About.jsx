import { GraduationCap, Coffee, Award, Users } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function About() {
  const { settings } = useSettings()
  return (
    <div>
      <section className="bg-coffee-gradient text-cream-light py-20">
        <div className="container-app text-center max-w-3xl mx-auto">
          <span className="badge bg-gold/20 text-gold border border-gold/30 mb-4">Our Story</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold">About {settings.siteName}</h1>
          <p className="mt-5 text-cream-light/80 text-lg">{settings.tagline}</p>
        </div>
      </section>

      <section className="container-app py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="section-title">More Than a Coffee Shop</h2>
          <p className="text-espresso-600 leading-relaxed mt-4">
            Kigali Coffee Lab sells and services coffee machines, from simple French presses
            to full commercial espresso setups, while also serving hand-crafted drinks brewed
            fresh at our lab. We believe great coffee starts with the right equipment and the
            right hands.
          </p>
          <p className="text-espresso-600 leading-relaxed mt-4">
            That's why we run hands-on barista training: grinding, dosing, tamping, extraction,
            milk steaming, latte art, and running a coffee bar from open to close. Whether
            you're equipping your kitchen, opening a café, or chasing a new career, KCL is
            where it starts.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Coffee, label: 'Machines Sold', value: '500+' },
            { icon: Users, label: 'Baristas Trained', value: '120+' },
            { icon: Award, label: 'Years Roasting', value: '8+' },
            { icon: GraduationCap, label: 'Training Hours', value: '2,000+' },
          ].map((s, i) => (
            <div key={i} className="card p-6 text-center">
              <s.icon className="mx-auto text-gold-dark mb-2" size={28} />
              <p className="text-2xl font-extrabold text-espresso-900">{s.value}</p>
              <p className="text-sm text-espresso-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-espresso-50 py-16">
        <div className="container-app">
          <h2 className="section-title text-center mb-10">Barista Training Program</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Foundations', desc: 'Coffee origins, grind size, dosing, tamping, and machine basics.' },
              { title: 'Extraction Mastery', desc: 'Dial in the perfect espresso shot and understand every variable.' },
              { title: 'Milk & Latte Art', desc: 'Steam, texture, and pour, from a simple heart to a rosetta.' },
            ].map((step, i) => (
              <div key={i} className="card p-6">
                <span className="w-10 h-10 rounded-full bg-espresso-900 text-gold flex items-center justify-center font-bold mb-4">{i+1}</span>
                <h3 className="font-display font-bold text-lg text-espresso-900">{step.title}</h3>
                <p className="text-espresso-500 text-sm mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-espresso-500 mt-8">
            Interested in training? Call us at <span className="font-bold text-espresso-800">{settings.phone}</span>
          </p>
        </div>
      </section>
    </div>
  )
}
