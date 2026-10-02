import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function Contact() {
  const { settings } = useSettings()
  return (
    <section className='bg-gray-200'>

      <section className="container-app py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-6 text-center">
          <Phone className="mx-auto text-gold-dark mb-3" size={26} />
          <p className="font-bold text-espresso-900">Call Us</p>
          <p className="text-sm text-espresso-500 mt-1">{settings.phone}</p>
        </div>
        <div className="card p-6 text-center">
          <Mail className="mx-auto text-gold-dark mb-3" size={26} />
          <p className="font-bold text-espresso-900">Email</p>
          <p className="text-sm text-espresso-500 mt-1">admin@kigalicoffeelab.com</p>
        </div>
        <div className="card p-6 text-center">
          <MapPin className="mx-auto text-gold-dark mb-3" size={26} />
          <p className="font-bold text-espresso-900">Visit</p>
          <p className="text-sm text-espresso-500 mt-1">{settings.address}</p>
        </div>
        <div className="card p-6 text-center">
          <Clock className="mx-auto text-gold-dark mb-3" size={26} />
          <p className="font-bold text-espresso-900">Hours</p>
          <p className="text-sm text-espresso-500 mt-1">Mon to Sat, 7am to 8pm</p>
        </div>
      </section>
    </section>
  )
}
