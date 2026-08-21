import { Link } from 'react-router-dom'
import { Coffee, Phone, MapPin, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function Footer() {
  const { settings } = useSettings()
  return (
    <footer className="bg-coffee-gradient text-cream-light mt-24">
      <div className="container-app py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-espresso-900">
              <Coffee size={18} />
            </span>
            <span className="font-display font-extrabold text-lg">{settings.siteName}</span>
          </div>
          <p className="text-cream-light/70 text-sm leading-relaxed">{settings.tagline}</p>
          <div className="flex gap-3 mt-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-espresso-900 transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-cream-light/70">
            <li><Link to="/shop" className="hover:text-gold">Coffee Machines</Link></li>
            <li><Link to="/services" className="hover:text-gold">Drinks Menu</Link></li>
            <li><Link to="/services#barista" className="hover:text-gold">Barista Training</Link></li>
            <li><Link to="/my-orders" className="hover:text-gold">Track My Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-cream-light/70">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/mission-vision" className="hover:text-gold">Mission &amp; Vision</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/login" className="hover:text-gold">Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-3">Visit / Call Us</h4>
          <ul className="space-y-3 text-sm text-cream-light/70">
            <li className="flex items-center gap-2"><Phone size={15} className="text-gold" /> {settings.phone}</li>
            <li className="flex items-center gap-2"><MapPin size={15} className="text-gold" /> {settings.address}</li>
            <li className="flex items-center gap-2"><Mail size={15} className="text-gold" /> hello@kigalicoffeelab.rw</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-cream-light/60">
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved. Brewed in Kigali, Rwanda ☕
      </div>
    </footer>
  )
}
