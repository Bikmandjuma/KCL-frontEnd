import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Armchair, Power } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import Modal from '../../components/admin/Modal'

const emptyForm = { label: '', capacity: 4, active: true }

// Tables & seats: the shop may have more physical tables than the app
// knows about, so guests can add one too (mid-checkout) - this is the
// full management view (edit/deactivate/delete), which stays staff-only.
export default function AdminTables() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/tables', { params: { all: true } })
      setTables(data)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (t) => { setEditing(t); setForm({ label: t.label, capacity: t.capacity, active: t.active }); setModalOpen(true) }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.label.trim()) return toast.error('Give the table a label, e.g. "Table 7"')
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/tables/${editing._id}`, form)
        toast.success('Table updated')
      } else {
        await api.post('/tables', form)
        toast.success('Table added')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not save table')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (t) => {
    try {
      await api.put(`/tables/${t._id}`, { active: !t.active })
      load()
    } catch { toast.error('Could not update table') }
  }

  const remove = async (t) => {
    if (!confirm(`Delete "${t.label}"? This cannot be undone.`)) return
    try {
      await api.delete(`/tables/${t._id}`)
      toast.success('Table deleted')
      load()
    } catch { toast.error('Could not delete table') }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Tables &amp; Seats</h1>
          <p className="text-espresso-500 text-sm mt-1">
            Add every physical table in the shop so dine-in customers can pick theirs at checkout.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Table</button>
      </div>

      {loading ? <Loader /> : tables.length === 0 ? (
        <div className="card p-10 text-center text-espresso-400">No tables yet. Add the first one.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((t) => (
            <div key={t._id} className={`card p-5 ${!t.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center">
                    <Armchair size={20} />
                  </span>
                  <div>
                    <p className="font-bold text-espresso-900">{t.label}</p>
                    <p className="text-xs text-espresso-400">Seats {t.capacity}</p>
                  </div>
                </div>
                <span className={`badge ${t.active ? 'bg-green-100 text-green-700' : 'bg-espresso-100 text-espresso-500'}`}>
                  {t.active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => openEdit(t)} className="btn-outline flex-1 !py-2 text-sm"><Pencil size={14} /> Edit</button>
                <button onClick={() => toggleActive(t)} className="btn-outline !py-2 !px-3" title={t.active ? 'Hide' : 'Activate'}><Power size={14} /></button>
                <button onClick={() => remove(t)} className="btn-outline !py-2 !px-3 !border-red-200 !text-red-600 hover:!bg-red-50"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Table' : 'Add Table'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Label</label>
            <input className="input" placeholder='e.g. "Table 7" or "Patio 2"' value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          </div>
          <div>
            <label className="label">Seats</label>
            <input type="number" min={1} className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-espresso-800">
            <input type="checkbox" className="accent-espresso-800 w-4 h-4" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Visible to customers at checkout
          </label>
          <button disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Table'}</button>
        </form>
      </Modal>
    </div>
  )
}
