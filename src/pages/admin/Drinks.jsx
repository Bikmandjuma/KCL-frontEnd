import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, EyeOff, Eye, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import api, { fileUrl } from '../../api/axios'
import Loader from '../../components/Loader'
import Modal from '../../components/admin/Modal'
import Pagination from '../../components/Pagination'
import CategoryDropdown from '../../components/CategoryDropdown'
import { formatRWF } from '../../utils/format'

const emptyForm = { name: '', price: '', category: 'Hot Drinks', desc: '', available: true }
const drinkCategories = ['Hot Drinks', 'Cold Drinks', 'Specialty']

export default function AdminDrinks() {
  const [drinks, setDrinks] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const params = { all: true, page, limit: 9 }
      if (search) params.search = search
      if (category) params.category = category
      const { data } = await api.get('/drinks', { params })
      setDrinks(data)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [page, search, category])
  useEffect(() => { setPage(1) }, [search, category])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFile(null); setModalOpen(true) }
  const openEdit = (d) => {
    setEditing(d)
    setForm({ name: d.name, price: d.price, category: d.category, desc: d.desc || '', available: d.available })
    setFile(null); setModalOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (file) fd.append('image', file)
      if (editing) {
        await api.put(`/drinks/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Drink updated')
      } else {
        await api.post('/drinks', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Drink added to menu')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Save failed')
    } finally { setSaving(false) }
  }

  const toggleAvailable = async (d) => {
    try { await api.put(`/drinks/${d._id}`, { available: !d.available }); load() }
    catch { toast.error('Could not update') }
  }

  const remove = async (id) => {
    if (!confirm('Remove this drink from the menu?')) return
    try { await api.delete(`/drinks/${id}`); toast.success('Removed'); load() }
    catch { toast.error('Could not delete') }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Drinks Menu</h1>
          <p className="text-espresso-500 text-sm mt-1">Manage the KCL hot, cold and specialty drinks menu.</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Drink</button>
      </div>

      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" />
          <input className="input !pl-10" placeholder="Search drinks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <CategoryDropdown value={category} onChange={setCategory} options={drinkCategories} className="sm:w-56" allLabel="All categories" />
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drinks.items.map((d) => (
              <div key={d._id} className="card p-4 flex gap-3">
                <img src={fileUrl(d.image)} className="w-16 h-16 rounded-xl object-cover bg-espresso-50" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-espresso-900 truncate">{d.name}</p>
                    <span className={`badge text-[10px] ${d.available ? 'bg-green-100 text-green-700' : 'bg-espresso-100 text-espresso-500'}`}>
                      {d.available ? 'On menu' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-espresso-400">{d.category}</p>
                  <p className="font-extrabold text-gold-dark mt-1">{formatRWF(d.price)}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => toggleAvailable(d)} className="p-1.5 rounded-lg hover:bg-espresso-100 text-espresso-500">
                      {d.available ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-espresso-100 text-espresso-500"><Pencil size={14} /></button>
                    <button onClick={() => remove(d._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
            {drinks.items.length === 0 && <p className="text-espresso-400 col-span-full text-center py-10">No drinks match your search.</p>}
          </div>
          <Pagination page={drinks.page} pages={drinks.pages} onChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Drink' : 'Add Drink'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Price (RWF)</label>
            <input type="number" required className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {drinkCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          </div>
          <div>
            <label className="label">Image {editing && '(leave empty to keep current)'}</label>
            <input type="file" accept="image/*" className="input" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Drink'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
