import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, EyeOff, Eye, Images } from 'lucide-react'
import toast from 'react-hot-toast'
import api, { fileUrl } from '../../api/axios'
import Loader from '../../components/Loader'
import Modal from '../../components/admin/Modal'
import Pagination from '../../components/Pagination'
import CategoryDropdown from '../../components/CategoryDropdown'
import { formatRWF } from '../../utils/format'

const emptyForm = { title: '', price: '', categories: '', brand: '', quantity: '', color: '', desc: '', size: '', active: true }

export default function AdminProducts() {
  const [products, setProducts] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const params = { all: true, page, limit: 10 }
      if (search) params.search = search
      if (category) params.category = category
      const { data } = await api.get('/products', { params })
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [page, search, category])
  useEffect(() => { setPage(1) }, [search, category])
  useEffect(() => { api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {}) }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFile(null); setGalleryFiles([]); setModalOpen(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({ title: p.title, price: p.price, categories: p.categories, brand: p.brand || '', quantity: p.quantity, color: p.color || '', desc: p.desc || '', size: p.size || '', active: p.active })
    setFile(null); setGalleryFiles([])
    setModalOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (file) fd.append('image', file)
      galleryFiles.forEach((f) => fd.append('gallery', f))

      if (editing) {
        await api.put(`/products/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Machine updated')
      } else {
        if (!file) { toast.error('Please choose a primary image'); setSaving(false); return }
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Machine added to store')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (p) => {
    try {
      await api.put(`/products/${p._id}`, { active: !p.active })
      load()
    } catch { toast.error('Could not update') }
  }

  const remove = async (id) => {
    if (!confirm('Delete this machine permanently?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Deleted')
      load()
    } catch { toast.error('Could not delete') }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Coffee Machines</h1>
          <p className="text-espresso-500 text-sm mt-1">Manage the machines available in your store.</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Machine</button>
      </div>

      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" />
          <input className="input !pl-10" placeholder="Search machines..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <CategoryDropdown value={category} onChange={setCategory} options={categories} className="sm:w-56" />
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-espresso-50 text-espresso-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Machine</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.items.map((p) => (
                  <tr key={p._id} className="border-t border-espresso-100 hover:bg-espresso-50/50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={fileUrl(p.image)} className="w-10 h-10 rounded-lg object-cover bg-espresso-50" />
                      <span className="font-semibold text-espresso-800">{p.title}</span>
                      {p.gallery?.length > 0 && <Images size={14} className="text-espresso-300" title={`${p.gallery.length} extra photos`} />}
                    </td>
                    <td className="px-4 py-3 text-espresso-500">{p.categories}</td>
                    <td className="px-4 py-3 font-semibold">{formatRWF(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={p.quantity <= 3 ? 'text-red-600 font-bold' : ''}>{p.quantity}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.active ? 'bg-green-100 text-green-700' : 'bg-espresso-100 text-espresso-500'}`}>
                        {p.active ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => toggleActive(p)} className="p-2 rounded-lg hover:bg-espresso-100 text-espresso-500" title={p.active ? 'Hide' : 'Show'}>
                          {p.active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-espresso-100 text-espresso-500"><Pencil size={16} /></button>
                        <button onClick={() => remove(p._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.items.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-espresso-400">No machines found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={products.page} pages={products.pages} onChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Machine' : 'Add New Machine'} wide>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Category / Machine Type</label>
            <input required className="input" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} />
          </div>
          <div>
            <label className="label">Brand</label>
            <input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <div>
            <label className="label">Price (RWF)</label>
            <input type="number" required className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="label">Stock Quantity</label>
            <input type="number" required className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div>
            <label className="label">Colour</label>
            <input className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </div>
          <div>
            <label className="label">Size</label>
            <input className="input" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          </div>
          <div>
            <label className="label">Primary Image {editing && '(leave empty to keep current)'}</label>
            <input type="file" accept="image/*" className="input" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div>
            <label className="label">Extra Gallery Photos (up to 5)</label>
            <input type="file" accept="image/*" multiple className="input" onChange={(e) => setGalleryFiles(Array.from(e.target.files).slice(0, 5))} />
            <p className="text-xs text-espresso-400 mt-1">Powers the auto-rotating photo carousel on the storefront card.</p>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Machine'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
