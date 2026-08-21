import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, wide=false }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/60 backdrop-blur-sm animate-fadeUp">
      <div className={`bg-white rounded-2xl shadow-soft w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-espresso-100 sticky top-0 bg-white z-10">
          <h3 className="font-display font-bold text-lg text-espresso-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-espresso-50 flex items-center justify-center text-espresso-500">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
