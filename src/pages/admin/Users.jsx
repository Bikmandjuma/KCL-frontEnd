import { useEffect, useState } from 'react'
import { Plus, Pencil, ShieldCheck, ShieldOff, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import Modal from '../../components/admin/Modal'
import Pagination from '../../components/Pagination'
import { useAuth } from '../../context/AuthContext'

const permList = [
  { key: 'manageProducts', label: 'Manage Coffee Machines' },
  { key: 'manageDrinks', label: 'Manage Drinks Menu' },
  { key: 'manageOrders', label: 'Manage Orders' },
  { key: 'manageBarista', label: 'Manage Barista Training' },
  { key: 'manageUsers', label: 'Manage Users & Roles' },
  { key: 'manageSettings', label: 'Manage Settings' },
  { key: 'viewDashboard', label: 'View Dashboard' },
]

const emptyStaffForm = { username: '', email: '', password: '', role: 'manager', permissions: {} }

export default function AdminUsers() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(emptyStaffForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      const { data } = await api.get('/users', { params })
      setUsers(data)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [page, search])
  useEffect(() => { setPage(1) }, [search])

  const togglePerm = (setFn, current, key) => {
    setFn({ ...current, permissions: { ...current.permissions, [key]: !current.permissions?.[key] } })
  }

  const createStaff = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/users/staff', form)
      toast.success(`${form.role === 'admin' ? 'Admin' : 'Manager'} account created`)
      setCreateOpen(false); setForm(emptyStaffForm); load()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not create account')
    } finally { setSaving(false) }
  }

  const openEdit = (u) => setEditUser({ ...u, permissions: u.permissions || {} })

  const saveEdit = async () => {
    setSaving(true)
    try {
      await api.put(`/users/staff/${editUser._id}`, { role: editUser.role, permissions: editUser.permissions, active: editUser.active })
      toast.success('User updated')
      setEditUser(null); load()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not update user')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Users &amp; Roles</h1>
          <p className="text-espresso-500 text-sm mt-1">Manage clients, and create Managers/Admins with specific permissions.</p>
        </div>
        {isAdmin && <button onClick={() => setCreateOpen(true)} className="btn-primary"><Plus size={18} /> Add Staff</button>}
      </div>

      <div className="card p-4 mb-6 relative">
        <Search size={18} className="absolute left-7 top-1/2 -translate-y-1/2 text-espresso-300" />
        <input className="input !pl-10" placeholder="Search by username or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-espresso-50 text-espresso-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.items.map((u) => (
                  <tr key={u._id} className="border-t border-espresso-100 hover:bg-espresso-50/50">
                    <td className="px-4 py-3 font-semibold text-espresso-800">{u.username}</td>
                    <td className="px-4 py-3 text-espresso-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-espresso-900 text-cream-light' : u.role === 'manager' ? 'bg-gold/20 text-gold-dark' : 'bg-espresso-100 text-espresso-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.active !== false ? (
                        <span className="badge bg-green-100 text-green-700"><ShieldCheck size={12}/> Active</span>
                      ) : (
                        <span className="badge bg-red-100 text-red-700"><ShieldOff size={12}/> Disabled</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Admin accounts cannot be edited here, and there is
                          intentionally no delete/trash action - use the
                          Active toggle in Edit to disable an account instead. */}
                      {isAdmin && u.role !== 'admin' && (
                        <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-espresso-100 text-espresso-500 inline-flex"><Pencil size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.items.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-espresso-400">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={users.page} pages={users.pages} onChange={setPage} />
        </>
      )}

      {/* Create staff modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Manager / Admin" wide>
        <form onSubmit={createStaff} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Username</label>
              <input required className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required minLength={6} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {form.role === 'manager' && (
            <div>
              <p className="label">Permissions</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {permList.map((p) => (
                  <label key={p.key} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-espresso-50 cursor-pointer">
                    <input type="checkbox" className="accent-espresso-800 w-4 h-4" checked={!!form.permissions[p.key]} onChange={() => togglePerm(setForm, form, p.key)} />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-outline">Cancel</button>
            <button disabled={saving} className="btn-primary">{saving ? 'Creating...' : 'Create Account'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit staff modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title={`Edit ${editUser?.username || ''}`} wide>
        {editUser && (
          <div className="space-y-4">
            <div>
              <label className="label">Role</label>
              <select className="input" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                <option value="guest">Guest / Client</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" className="accent-espresso-800 w-4 h-4" checked={editUser.active !== false} onChange={(e) => setEditUser({ ...editUser, active: e.target.checked })} />
              Account Active (uncheck to disable instead of deleting)
            </label>

            {editUser.role === 'manager' && (
              <div>
                <p className="label">Permissions</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {permList.map((p) => (
                    <label key={p.key} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-espresso-50 cursor-pointer">
                      <input type="checkbox" className="accent-espresso-800 w-4 h-4" checked={!!editUser.permissions?.[p.key]} onChange={() => togglePerm(setEditUser, editUser, p.key)} />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditUser(null)} className="btn-outline">Cancel</button>
              <button disabled={saving} onClick={saveEdit} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
