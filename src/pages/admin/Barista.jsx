import { useEffect, useState } from 'react'
import { Plus, Search, CheckCircle2, XCircle, Clock, Power } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import Loader from '../../components/Loader'
import Modal from '../../components/admin/Modal'
import Pagination from '../../components/Pagination'
import { formatDate } from '../../utils/format'

const emptySessionForm = { title: '', description: '', startDate: '', endDate: '', capacity: 20, active: true }

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
}

export default function AdminBarista() {
  const [sessions, setSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [sessionModalOpen, setSessionModalOpen] = useState(false)
  const [sessionForm, setSessionForm] = useState(emptySessionForm)
  const [savingSession, setSavingSession] = useState(false)

  const [applications, setApplications] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [loadingApps, setLoadingApps] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const loadSessions = async () => {
    setLoadingSessions(true)
    try {
      const { data } = await api.get('/barista/sessions')
      setSessions(data)
    } finally { setLoadingSessions(false) }
  }

  const loadApplications = async () => {
    setLoadingApps(true)
    try {
      const params = { page, limit: 8 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const { data } = await api.get('/barista/applications', { params })
      setApplications(data)
    } finally { setLoadingApps(false) }
  }

  useEffect(() => { loadSessions() }, [])
  useEffect(() => { loadApplications() }, [page, search, statusFilter])
  useEffect(() => { setPage(1) }, [search, statusFilter])

  const createSession = async (e) => {
    e.preventDefault()
    setSavingSession(true)
    try {
      await api.post('/barista/sessions', sessionForm)
      toast.success('Training session published')
      setSessionModalOpen(false)
      setSessionForm(emptySessionForm)
      loadSessions()
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not create session')
    } finally { setSavingSession(false) }
  }

  const toggleSessionActive = async (s) => {
    try {
      await api.put(`/barista/sessions/${s._id}`, { active: !s.active })
      toast.success(s.active ? 'Session closed' : 'Session opened')
      loadSessions()
    } catch { toast.error('Could not update session') }
  }

  const updateApplicationStatus = async (id, status) => {
    try {
      await api.put(`/barista/applications/${id}`, { status })
      toast.success('Application updated')
      loadApplications()
    } catch { toast.error('Could not update application') }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Barista Training</h1>
          <p className="text-espresso-500 text-sm mt-1">Publish training sessions and review applications.</p>
        </div>
        <button onClick={() => setSessionModalOpen(true)} className="btn-primary"><Plus size={18} /> New Session</button>
      </div>

      {/* Sessions */}
      {loadingSessions ? <Loader /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {sessions.map((s) => (
            <div key={s._id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`badge ${s.active ? 'bg-green-100 text-green-700' : 'bg-espresso-100 text-espresso-500'}`}>
                  {s.active ? 'Open' : 'Closed'}
                </span>
                <button onClick={() => toggleSessionActive(s)} className="p-1.5 rounded-lg hover:bg-espresso-100 text-espresso-500" title={s.active ? 'Close session' : 'Reopen session'}>
                  <Power size={14} />
                </button>
              </div>
              <p className="font-bold text-espresso-900">{s.title}</p>
              <p className="text-sm text-espresso-500 mt-1 line-clamp-2">{s.description}</p>
              <p className="text-xs text-espresso-400 mt-2">Capacity: {s.capacity}</p>
            </div>
          ))}
          {sessions.length === 0 && <p className="text-espresso-400 col-span-full text-center py-10">No sessions published yet.</p>}
        </div>
      )}

      {/* Applications */}
      <h2 className="font-display font-bold text-xl text-espresso-900 mb-4">Applications</h2>
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso-300" />
          <input className="input !pl-10" placeholder="Search by name, email or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input sm:!w-48" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      {loadingApps ? <Loader /> : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-espresso-50 text-espresso-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Applicant</th>
                  <th className="text-left px-4 py-3">Contact</th>
                  <th className="text-left px-4 py-3">Location</th>
                  <th className="text-left px-4 py-3">Session</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Applied</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.items.map((a) => (
                  <tr key={a._id} className="border-t border-espresso-100 hover:bg-espresso-50/50">
                    <td className="px-4 py-3 font-semibold text-espresso-800">{a.fullName}<p className="text-xs font-normal text-espresso-400">{a.gender}</p></td>
                    <td className="px-4 py-3 text-espresso-500">{a.phone}<p className="text-xs">{a.email}</p></td>
                    <td className="px-4 py-3 text-espresso-500">{[a.district, a.sector].filter(Boolean).join(', ') || 'n/a'}</td>
                    <td className="px-4 py-3 text-espresso-500">{a.session?.title}</td>
                    <td className="px-4 py-3"><span className={`badge ${statusColors[a.status]}`}>{a.status}</span></td>
                    <td className="px-4 py-3 text-espresso-400">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => updateApplicationStatus(a._id, 'Approved')} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve"><CheckCircle2 size={16} /></button>
                        <button onClick={() => updateApplicationStatus(a._id, 'Rejected')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Reject"><XCircle size={16} /></button>
                        <button onClick={() => updateApplicationStatus(a._id, 'Pending')} className="p-1.5 rounded-lg hover:bg-espresso-100 text-espresso-500" title="Mark pending"><Clock size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {applications.items.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-espresso-400">No applications found.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={applications.page} pages={applications.pages} onChange={setPage} />
        </>
      )}

      <Modal open={sessionModalOpen} onClose={() => setSessionModalOpen(false)} title="Publish Training Session">
        <form onSubmit={createSession} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={sessionForm.description} onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input type="date" className="input" value={sessionForm.startDate} onChange={(e) => setSessionForm({ ...sessionForm, startDate: e.target.value })} />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" className="input" value={sessionForm.endDate} onChange={(e) => setSessionForm({ ...sessionForm, endDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Capacity</label>
            <input type="number" className="input" value={sessionForm.capacity} onChange={(e) => setSessionForm({ ...sessionForm, capacity: e.target.value })} />
          </div>
          <p className="text-xs text-espresso-400">Publishing a new active session automatically closes any other open session.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setSessionModalOpen(false)} className="btn-outline">Cancel</button>
            <button disabled={savingSession} className="btn-primary">{savingSession ? 'Publishing...' : 'Publish Session'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
