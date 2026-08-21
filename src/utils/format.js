export const formatRWF = (amount = 0) =>
  new Intl.NumberFormat('en-RW', { maximumFractionDigits: 0 }).format(amount) + ' RWF'

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export const timeAgo = (d) => {
  const seconds = Math.floor((new Date() - new Date(d)) / 1000)
  const map = [
    ['year', 31536000], ['month', 2592000], ['day', 86400],
    ['hour', 3600], ['minute', 60],
  ]
  for (const [label, secs] of map) {
    const val = Math.floor(seconds / secs)
    if (val >= 1) return `${val} ${label}${val > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
