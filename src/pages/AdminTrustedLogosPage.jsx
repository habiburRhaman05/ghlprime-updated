'use client'

import { useEffect, useState } from 'react'
import { Link2, Pencil, Plus, Trash2, X } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import ImageUrlField from '../components/admin/ImageUrlField'
import Modal from '../components/admin/Modal'
import { createPartnerLogo, deletePartnerLogo, fetchAdminPartnerLogos, updatePartnerLogo } from '../lib/logosApi'
import { getSession, signOut } from '../lib/auth'

const initialLogoForm = {
  name: '',
  image_url: '',
  website_url: '',
  sort_order: '',
  published: true,
}

function mapLogoToForm(logo) {
  return {
    name: logo.name || '',
    image_url: logo.image_url || '',
    website_url: logo.website_url || '',
    sort_order: String(logo.sort_order ?? ''),
    published: logo.published !== false,
  }
}

export default function AdminTrustedLogosPage() {
  const [session, setSession] = useState(undefined)
  const [logos, setLogos] = useState([])
  const [logoForm, setLogoForm] = useState(initialLogoForm)
  const [editingLogoId, setEditingLogoId] = useState(null)
  const [status, setStatus] = useState('')
  const [savingLogo, setSavingLogo] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    getSession().then(setSession)
    fetchAdminPartnerLogos().then(setLogos)
  }, [])

  async function handleLogoSubmit(event) {
    event.preventDefault()
    setSavingLogo(true)
    setStatus('')

    const payload = { ...logoForm, sort_order: Number(logoForm.sort_order || 999) }
    const action = editingLogoId ? updatePartnerLogo(editingLogoId, payload) : createPartnerLogo(payload)
    const { data, error } = await action

    if (error) {
      setStatus(error.message || `Failed to ${editingLogoId ? 'update' : 'create'} logo`)
      setSavingLogo(false)
      return
    }

    if (editingLogoId) {
      setLogos((current) => current.map((item) => (item.id === editingLogoId ? data : item)).sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Logo updated successfully.')
    } else {
      setLogos((current) => [...current, data].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Logo added successfully.')
    }

    setLogoForm(initialLogoForm)
    setEditingLogoId(null)
    setSavingLogo(false)
    setShowAddModal(false)
  }

  function startEditingLogo(logo) {
    setEditingLogoId(logo.id)
    setLogoForm(mapLogoToForm(logo))
    setStatus('')
    setShowAddModal(true)
  }

  function cancelEditingLogo() {
    setEditingLogoId(null)
    setLogoForm(initialLogoForm)
    setStatus('')
    setShowAddModal(false)
  }

  async function handleDeleteLogo(id) {
    const { error } = await deletePartnerLogo(id)
    if (error) {
      setStatus(error.message || 'Failed to delete logo')
      return
    }
    setLogos((current) => current.filter((logo) => logo.id !== id))
    if (editingLogoId === id) cancelEditingLogo()
    setStatus('Logo deleted.')
  }

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading trusted logos...">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><Link2 size={16} /> Trusted Logos</span>
          <h1>Manage the trusted company logo slider separately.</h1>
          <p>Company logos now live in their own menu instead of sitting under the case studies form.</p>
        </div>
      </div>
      {status ? <div className="form-status">{status}</div> : null}

      <div className="admin-list-card futuristic-card refined-admin-card">
        <div className="admin-card-head admin-section-head">
          <h2>Trusted Logo Library</h2>
          <span>Only image logos will show on the homepage slider</span>
          <button type="button" className="admin-add-trigger" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Trusted Logo</button>
        </div>
        <div className="admin-study-list refined-admin-study-list">
          {logos.map((logo) => (
            <article key={logo.id || logo.name} className="admin-study-item refined-admin-study-item">
              <div className="admin-study-preview-thumb">{logo.image_url ? <img src={logo.image_url} alt={logo.name} /> : <div className="admin-thumb-fallback">No image</div>}</div>
              <div className="admin-study-copy"><strong>{logo.name}</strong><span>{logo.website_url || 'No website URL'}</span><small>{logo.published === false ? 'Hidden' : `Live · Order ${logo.sort_order ?? 999}`}</small></div>
              <div className="admin-study-actions">
                <button type="button" className="team-edit-btn" onClick={() => startEditingLogo(logo)}><Pencil size={15} /> Edit</button>
                <button type="button" className="admin-delete-btn" onClick={() => handleDeleteLogo(logo.id)}><Trash2 size={14} /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title={editingLogoId ? 'Edit Trusted Logo' : 'Add Trusted Logo'}>
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleLogoSubmit}>
          <div className="admin-card-head"><h2>{editingLogoId ? 'Edit Trusted Logo' : 'Add Trusted Logo'}</h2><span>Separate section menu</span></div>
          <div className="admin-form-grid">
            <label><span>Company Name</span><input value={logoForm.name} onChange={(event) => setLogoForm((current) => ({ ...current, name: event.target.value }))} required /></label>
            <label><span>Sort Order</span><input type="number" min="1" value={logoForm.sort_order} onChange={(event) => setLogoForm((current) => ({ ...current, sort_order: event.target.value }))} placeholder="1 = first" /></label>
            <ImageUrlField label="Logo Image URL" value={logoForm.image_url} onChange={(url) => setLogoForm((current) => ({ ...current, image_url: url }))} required />
            <label className="full-width"><span>Website URL (optional)</span><input value={logoForm.website_url} onChange={(event) => setLogoForm((current) => ({ ...current, website_url: event.target.value }))} placeholder="https://company.com" /></label>
            <label className="checkbox-row"><input type="checkbox" checked={logoForm.published} onChange={(event) => setLogoForm((current) => ({ ...current, published: event.target.checked }))} /><span>Published</span></label>
          </div>
          <div className="team-edit-actions admin-form-actions">
            <button className="primary-pill large auth-submit" type="submit" disabled={savingLogo}>{savingLogo ? 'Saving...' : (editingLogoId ? 'Save Trusted Logo' : 'Add Trusted Logo')}</button>
            {editingLogoId ? <button type="button" className="team-edit-btn" onClick={cancelEditingLogo} disabled={savingLogo}><X size={15} /> Cancel Edit</button> : null}
          </div>
        </form>
      </Modal>
    </AdminShell>
  )
}
