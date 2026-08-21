export default function Loader({ label = 'Brewing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-espresso-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-espresso-700 border-transparent animate-spin" />
      </div>
      <p className="text-espresso-600 font-medium">{label}</p>
    </div>
  )
}
