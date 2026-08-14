import { useEffect, useState } from 'react'
import { Image as ImageIcon, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import ImageUrlField from '../components/admin/ImageUrlField'
import Modal from '../components/admin/Modal'
import { createMeetingGalleryItem, deleteMeetingGalleryItem, fetchAdminMeetingGallery, updateMeetingGalleryItem } from '../lib/meetingGalleryApi'
import { getSession, signOut } from '../lib/auth'

const initialMeetingForm = {
  title: '',
  image_url: '',
  sort_order: '',
  published: true,
}

function mapMeetingToForm(item) {
  return {
    title: item.title || '',
    image_url: item.image_url || '',
    sort_order: String(item.sort_order ?? ''),
    published: item.published !== false,
  }
}

export default function AdminMeetingGalleryPage() {
  const [session, setSession] = useState(undefined)
  const [meetings, setMeetings] = useState([])
  const [meetingForm, setMeetingForm] = useState(initialMeetingForm)
  const [editingMeetingId, setEditingMeetingId] = useState(null)
  const [status, setStatus] = useState('')
  const [savingMeeting, setSavingMeeting] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    getSession().then(setSession)
    fetchAdminMeetingGallery().then(setMeetings)
  }, [])

  async function handleMeetingSubmit(event) {
    event.preventDefault()
    setSavingMeeting(true)
    setStatus('')

    const payload = { ...meetingForm, sort_order: Number(meetingForm.sort_order || 999) }
    const action = editingMeetingId ? updateMeetingGalleryItem(editingMeetingId, payload) : createMeetingGalleryItem(payload)
    const { data, error } = await action

    if (error) {
      setStatus(error.message || `Failed to ${editingMeetingId ? 'update' : 'create'} meeting image`)
      setSavingMeeting(false)
      return
    }

    if (editingMeetingId) {
      setMeetings((current) => current.map((item) => (item.id === editingMeetingId ? data : item)).sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Meeting image updated successfully.')
    } else {
      setMeetings((current) => [...current, data].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Meeting image added successfully.')
    }

    setMeetingForm(initialMeetingForm)
    setEditingMeetingId(null)
    setSavingMeeting(false)
    setShowAddModal(false)
  }

  function startEditingMeeting(item) {
    setEditingMeetingId(item.id)
    setMeetingForm(mapMeetingToForm(item))
    setStatus('')
    setShowAddModal(true)
  }

  function cancelEditingMeeting() {
    setEditingMeetingId(null)
    setMeetingForm(initialMeetingForm)
    setStatus('')
    setShowAddModal(false)
  }

  async function handleDeleteMeeting(id) {
    const { error } = await deleteMeetingGalleryItem(id)
    if (error) {
      setStatus(error.message || 'Failed to delete meeting image')
      return
    }
    setMeetings((current) => current.filter((item) => item.id !== id))
    if (editingMeetingId === id) cancelEditingMeeting()
    setStatus('Meeting image deleted.')
  }

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading meeting gallery...">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><ImageIcon size={16} /> Meeting Gallery</span>
          <h1>Manage the Working Together image section separately.</h1>
          <p>Add, edit, delete, and order the images shown before the footer on homepage and booking page.</p>
        </div>
      </div>
      {status ? <div className="form-status">{status}</div> : null}

      <div className="admin-list-card futuristic-card refined-admin-card">
        <div className="admin-card-head admin-section-head">
          <h2>Meeting Gallery Library</h2>
          <span>Separate section menu</span>
          <button type="button" className="admin-add-trigger" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Meeting Image</button>
        </div>
        <div className="admin-study-list refined-admin-study-list">
          {meetings.map((item) => (
            <article key={item.id || item.title} className="admin-study-item refined-admin-study-item">
              <div className="admin-study-preview-thumb">{item.image_url ? <img src={item.image_url} alt={item.title || 'Meeting image'} /> : <div className="admin-thumb-fallback">No image</div>}</div>
              <div className="admin-study-copy"><strong>{item.title || 'Untitled meeting image'}</strong><span>{item.image_url}</span><small>{item.published === false ? 'Hidden' : `Live · Order ${item.sort_order ?? 999}`}</small></div>
              <div className="admin-study-actions">
                <button type="button" className="team-edit-btn" onClick={() => startEditingMeeting(item)}><Pencil size={15} /> Edit</button>
                <button type="button" className="admin-delete-btn" onClick={() => handleDeleteMeeting(item.id)}><Trash2 size={14} /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title={editingMeetingId ? 'Edit Meeting Image' : 'Add Meeting Image'}>
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleMeetingSubmit}>
          <div className="admin-card-head"><h2>{editingMeetingId ? 'Edit Meeting Image' : 'Add Meeting Image'}</h2><span>Dedicated manager</span></div>
          <div className="admin-form-grid">
            <label><span>Title (optional)</span><input value={meetingForm.title} onChange={(event) => setMeetingForm((current) => ({ ...current, title: event.target.value }))} /></label>
            <label><span>Sort Order</span><input type="number" min="1" value={meetingForm.sort_order} onChange={(event) => setMeetingForm((current) => ({ ...current, sort_order: event.target.value }))} placeholder="1 = first" /></label>
            <ImageUrlField label="Meeting Image URL" value={meetingForm.image_url} onChange={(url) => setMeetingForm((current) => ({ ...current, image_url: url }))} required />
            <label className="checkbox-row"><input type="checkbox" checked={meetingForm.published} onChange={(event) => setMeetingForm((current) => ({ ...current, published: event.target.checked }))} /><span>Published</span></label>
          </div>
          <div className="team-edit-actions admin-form-actions">
            <button className="primary-pill large auth-submit" type="submit" disabled={savingMeeting}>{savingMeeting ? 'Saving...' : (editingMeetingId ? 'Save Meeting Image' : 'Add Meeting Image')}</button>
            {editingMeetingId ? <button type="button" className="team-edit-btn" onClick={cancelEditingMeeting} disabled={savingMeeting}><X size={15} /> Cancel Edit</button> : null}
          </div>
        </form>
      </Modal>
    </AdminShell>
  )
}
