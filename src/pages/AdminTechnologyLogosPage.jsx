import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, Wrench, X } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import ImageUrlField from '../components/admin/ImageUrlField'
import Modal from '../components/admin/Modal'
import { createTechnologyLogo, deleteTechnologyLogo, fetchAdminTechnologyLogos, updateTechnologyLogo } from '../lib/technologyLogosApi'
import { getSession, signOut } from '../lib/auth'

const initialTechLogoForm = {
  name: '',
  image_url: '',
  sort_order: '',
  published: true,
}

function mapTechLogoToForm(item) {
  return {
    name: item.name || '',
    image_url: item.image_url || '',
    sort_order: String(item.sort_order ?? ''),
    published: item.published !== false,
  }
}

export default function AdminTechnologyLogosPage() {
  const [session, setSession] = useState(undefined)
  const [technologyLogos, setTechnologyLogos] = useState([])
  const [techLogoForm, setTechLogoForm] = useState(initialTechLogoForm)
  const [editingTechLogoId, setEditingTechLogoId] = useState(null)
  const [status, setStatus] = useState('')
  const [savingTechLogo, setSavingTechLogo] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    getSession().then(setSession)
    fetchAdminTechnologyLogos().then(setTechnologyLogos)
  }, [])

  async function handleTechLogoSubmit(event) {
    event.preventDefault()
    setSavingTechLogo(true)
    setStatus('')

    const payload = { ...techLogoForm, sort_order: Number(techLogoForm.sort_order || 999) }
    const action = editingTechLogoId ? updateTechnologyLogo(editingTechLogoId, payload) : createTechnologyLogo(payload)
    const { data, error } = await action

    if (error) {
      setStatus(error.message || `Failed to ${editingTechLogoId ? 'update' : 'create'} technology logo`)
      setSavingTechLogo(false)
      return
    }

    if (editingTechLogoId) {
      setTechnologyLogos((current) => current.map((item) => (item.id === editingTechLogoId ? data : item)).sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Technology logo updated successfully.')
    } else {
      setTechnologyLogos((current) => [...current, data].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Technology logo added successfully.')
    }

    setTechLogoForm(initialTechLogoForm)
    setEditingTechLogoId(null)
    setSavingTechLogo(false)
    setShowAddModal(false)
  }

  function startEditingTechLogo(item) {
    setEditingTechLogoId(item.id)
    setTechLogoForm(mapTechLogoToForm(item))
    setStatus('')
    setShowAddModal(true)
  }

  function cancelEditingTechLogo() {
    setEditingTechLogoId(null)
    setTechLogoForm(initialTechLogoForm)
    setStatus('')
    setShowAddModal(false)
  }

  async function handleDeleteTechLogo(id) {
    const { error } = await deleteTechnologyLogo(id)
    if (error) {
      setStatus(error.message || 'Failed to delete technology logo')
      return
    }
    setTechnologyLogos((current) => current.filter((item) => item.id !== id))
    if (editingTechLogoId === id) cancelEditingTechLogo()
    setStatus('Technology logo deleted.')
  }

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading technology logos...">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><Wrench size={16} /> Technology Logos</span>
          <h1>Manage the rotating technology logo cloud separately.</h1>
          <p>Technology logos now live under their own dedicated menu with separate form and library.</p>
        </div>
      </div>
      {status ? <div className="form-status">{status}</div> : null}

      <div className="admin-list-card futuristic-card refined-admin-card">
        <div className="admin-card-head admin-section-head">
          <h2>Technology Logo Library</h2>
          <span>Only this menu controls them</span>
          <button type="button" className="admin-add-trigger" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Technology Logo</button>
        </div>
        <div className="admin-study-list refined-admin-study-list">
          {technologyLogos.map((item) => (
            <article key={item.id || item.name} className="admin-study-item refined-admin-study-item">
              <div className="admin-study-preview-thumb">{item.image_url ? <img src={item.image_url} alt={item.name} /> : <div className="admin-thumb-fallback">No image</div>}</div>
              <div className="admin-study-copy"><strong>{item.name}</strong><span>{item.image_url}</span><small>{item.published === false ? 'Hidden' : `Live · Order ${item.sort_order ?? 999}`}</small></div>
              <div className="admin-study-actions">
                <button type="button" className="team-edit-btn" onClick={() => startEditingTechLogo(item)}><Pencil size={15} /> Edit</button>
                <button type="button" className="admin-delete-btn" onClick={() => handleDeleteTechLogo(item.id)}><Trash2 size={14} /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title={editingTechLogoId ? 'Edit Technology Logo' : 'Add Technology Logo'}>
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleTechLogoSubmit}>
          <div className="admin-card-head"><h2>{editingTechLogoId ? 'Edit Technology Logo' : 'Add Technology Logo'}</h2><span>Separate section menu</span></div>
          <div className="admin-form-grid">
            <label><span>Technology Name</span><input value={techLogoForm.name} onChange={(event) => setTechLogoForm((current) => ({ ...current, name: event.target.value }))} required /></label>
            <label><span>Sort Order</span><input type="number" min="1" value={techLogoForm.sort_order} onChange={(event) => setTechLogoForm((current) => ({ ...current, sort_order: event.target.value }))} placeholder="1 = first" /></label>
            <ImageUrlField label="Technology Logo URL" value={techLogoForm.image_url} onChange={(url) => setTechLogoForm((current) => ({ ...current, image_url: url }))} required />
            <label className="checkbox-row"><input type="checkbox" checked={techLogoForm.published} onChange={(event) => setTechLogoForm((current) => ({ ...current, published: event.target.checked }))} /><span>Published</span></label>
          </div>
          <div className="team-edit-actions admin-form-actions">
            <button className="primary-pill large auth-submit" type="submit" disabled={savingTechLogo}>{savingTechLogo ? 'Saving...' : (editingTechLogoId ? 'Save Technology Logo' : 'Add Technology Logo')}</button>
            {editingTechLogoId ? <button type="button" className="team-edit-btn" onClick={cancelEditingTechLogo} disabled={savingTechLogo}><X size={15} /> Cancel Edit</button> : null}
          </div>
        </form>
      </Modal>
    </AdminShell>
  )
}
