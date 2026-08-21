import { Link } from 'react-router-dom'
import { Coffee } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <Coffee size={56} className="text-espresso-300 mb-4" />
      <h1 className="font-display text-5xl font-extrabold text-espresso-900">404</h1>
      <p className="text-espresso-500 mt-2">This page has gone cold. Let's get you back.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  )
}
