'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUp, BarChart3, FilePlus2, Layers3, Link2, LogOut, Pencil, Plus, Save, Users, X } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import ImageUrlField from '../components/admin/ImageUrlField'
import Modal from '../components/admin/Modal'
import { getSession, signOut } from '../lib/auth'
import {
  createTeamMember,
  createTeamPageExpert,
  deleteTeamMember,
  deleteTeamPageExpert,
  fetchTeamMembers,
  fetchTeamPageExperts,
  updateTeamMember,
  updateTeamPageExpert,
} from '../lib/teamApi'

const initialLeaderForm = {
  name: '',
  role: '',
  description: '',
  image_url: '',
  sort_order: '',
  linkedin_url: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  upwork_url: '',
  website_url: '',
}

const initialExpertForm = {
  name: '',
  title: '',
  image_url: '',
  sort_order: '',
}

function normalizeOrderValue(value) {
  if (value === '' || value === null || value === undefined) return 999

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 999

  return Math.max(1, Math.floor(parsed))
}

function sortByDisplayOrder(items = []) {
  return [...items].sort((a, b) => {
    const orderDiff = normalizeOrderValue(a.sort_order) - normalizeOrderValue(b.sort_order)
    if (orderDiff !== 0) return orderDiff

    const createdAtA = a.created_at ? new Date(a.created_at).getTime() : 0
    const createdAtB = b.created_at ? new Date(b.created_at).getTime() : 0
    return createdAtA - createdAtB
  })
}

function shiftItem(items, index, direction) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= items.length) return items

  const nextItems = [...items]
  const current = nextItems[index]
  const target = nextItems[targetIndex]

  nextItems[index] = {
    ...current,
    sort_order: normalizeOrderValue(target.sort_order),
  }
  nextItems[targetIndex] = {
    ...target,
    sort_order: normalizeOrderValue(current.sort_order),
  }

  return sortByDisplayOrder(nextItems)
}

function TeamOrderActions({ onSave, saving }) {
  return (
    <div className="team-order-actions">
      <button type="button" className="team-order-save-btn" onClick={onSave} disabled={saving}>
        <Save size={15} /> {saving ? 'Saving...' : 'Save order'}
      </button>
    </div>
  )
}

function LeaderSocialPreview({ leader }) {
  const links = [
    leader.linkedin_url,
    leader.facebook_url,
    leader.instagram_url,
    leader.twitter_url,
    leader.upwork_url,
    leader.website_url,
  ].filter(Boolean)

  if (!links.length) return null

  return (
    <div className="leader-social-preview">
      <span>{links.length} social links</span>
    </div>
  )
}

export default function AdminTeamPage({ defaultTab = 'leaders' }) {
  const [session, setSession] = useState(undefined)
  const [leaders, setLeaders] = useState([])
  const [experts, setExperts] = useState([])
  const [leaderForm, setLeaderForm] = useState(initialLeaderForm)
  const [expertForm, setExpertForm] = useState(initialExpertForm)
  const [editingLeaderId, setEditingLeaderId] = useState(null)
  const [editingExpertId, setEditingExpertId] = useState(null)
  const [editingLeaderForm, setEditingLeaderForm] = useState(initialLeaderForm)
  const [editingExpertForm, setEditingExpertForm] = useState(initialExpertForm)
  const [status, setStatus] = useState('')
  const [savingLeader, setSavingLeader] = useState(false)
  const [savingExpert, setSavingExpert] = useState(false)
  const [savingLeaderOrder, setSavingLeaderOrder] = useState(false)
  const [savingExpertOrder, setSavingExpertOrder] = useState(false)
  const [savingEditedLeader, setSavingEditedLeader] = useState(false)
  const [savingEditedExpert, setSavingEditedExpert] = useState(false)
  const [showAddLeaderModal, setShowAddLeaderModal] = useState(false)
  const [showAddExpertModal, setShowAddExpertModal] = useState(false)
  const showLeaders = defaultTab === 'leaders'
  const showExperts = defaultTab === 'experts'

  useEffect(() => {
    getSession().then(setSession)
    fetchTeamMembers().then((data) => setLeaders(sortByDisplayOrder(data)))
    fetchTeamPageExperts().then((data) => setExperts(sortByDisplayOrder(data)))
  }, [])

  function startLeaderEdit(member) {
    setEditingLeaderId(member.id)
    setEditingLeaderForm({
      name: member.name || '',
      role: member.role || '',
      description: member.description || '',
      image_url: member.image_url || '',
      sort_order: String(normalizeOrderValue(member.sort_order)),
      linkedin_url: member.linkedin_url || '',
      facebook_url: member.facebook_url || '',
      instagram_url: member.instagram_url || '',
      twitter_url: member.twitter_url || '',
      upwork_url: member.upwork_url || '',
      website_url: member.website_url || '',
    })
    setStatus('')
  }

  function startExpertEdit(member) {
    setEditingExpertId(member.id)
    setEditingExpertForm({
      name: member.name || '',
      title: member.title || '',
      image_url: member.image_url || '',
      sort_order: String(normalizeOrderValue(member.sort_order)),
    })
    setStatus('')
  }

  function cancelLeaderEdit() {
    setEditingLeaderId(null)
    setEditingLeaderForm(initialLeaderForm)
  }

  function cancelExpertEdit() {
    setEditingExpertId(null)
    setEditingExpertForm(initialExpertForm)
  }

  async function handleLeaderSubmit(event) {
    event.preventDefault()
    setSavingLeader(true)
    setStatus('')

    const payload = {
      ...leaderForm,
      sort_order: normalizeOrderValue(leaderForm.sort_order),
    }

    const { data, error } = await createTeamMember(payload)

    if (error) {
      setStatus(error.message || 'Failed to create leader')
      setSavingLeader(false)
      return
    }

    setLeaders((current) => sortByDisplayOrder([...current, data]))
    setLeaderForm(initialLeaderForm)
    setStatus('Leader added successfully.')
    setSavingLeader(false)
    setShowAddLeaderModal(false)
  }

  async function handleExpertSubmit(event) {
    event.preventDefault()
    setSavingExpert(true)
    setStatus('')

    const payload = {
      ...expertForm,
      sort_order: normalizeOrderValue(expertForm.sort_order),
    }

    const { data, error } = await createTeamPageExpert(payload)

    if (error) {
      setStatus(error.message || 'Failed to create expert')
      setSavingExpert(false)
      return
    }

    setExperts((current) => sortByDisplayOrder([...current, data]))
    setExpertForm(initialExpertForm)
    setStatus('Expert added successfully.')
    setSavingExpert(false)
    setShowAddExpertModal(false)
  }

  async function handleLeaderEditSubmit(id) {
    setSavingEditedLeader(true)
    setStatus('')

    const payload = {
      ...editingLeaderForm,
      sort_order: normalizeOrderValue(editingLeaderForm.sort_order),
    }

    const { data, error } = await updateTeamMember(id, payload)

    if (error) {
      setStatus(error.message || 'Failed to update leader')
      setSavingEditedLeader(false)
      return
    }

    setLeaders((current) => sortByDisplayOrder(current.map((member) => (member.id === id ? data : member))))
    cancelLeaderEdit()
    setStatus('Leader updated successfully.')
    setSavingEditedLeader(false)
  }

  async function handleExpertEditSubmit(id) {
    setSavingEditedExpert(true)
    setStatus('')

    const payload = {
      ...editingExpertForm,
      sort_order: normalizeOrderValue(editingExpertForm.sort_order),
    }

    const { data, error } = await updateTeamPageExpert(id, payload)

    if (error) {
      setStatus(error.message || 'Failed to update expert')
      setSavingEditedExpert(false)
      return
    }

    setExperts((current) => sortByDisplayOrder(current.map((member) => (member.id === id ? data : member))))
    cancelExpertEdit()
    setStatus('Expert updated successfully.')
    setSavingEditedExpert(false)
  }

  async function handleDeleteLeader(id) {
    const { error } = await deleteTeamMember(id)
    if (error) {
      setStatus(error.message || 'Failed to delete leader')
      return
    }

    setLeaders((current) => current.filter((member) => member.id !== id))
    if (editingLeaderId === id) cancelLeaderEdit()
    setStatus('Leader deleted.')
  }

  async function handleDeleteExpert(id) {
    const { error } = await deleteTeamPageExpert(id)
    if (error) {
      setStatus(error.message || 'Failed to delete expert')
      return
    }

    setExperts((current) => current.filter((member) => member.id !== id))
    if (editingExpertId === id) cancelExpertEdit()
    setStatus('Expert deleted.')
  }

  async function handleSaveLeaderOrder() {
    setSavingLeaderOrder(true)
    setStatus('')

    try {
      for (let index = 0; index < leaders.length; index += 1) {
        const member = leaders[index]
        const nextOrder = index + 1

        if (normalizeOrderValue(member.sort_order) === nextOrder) continue

        const { error } = await updateTeamMember(member.id, { sort_order: nextOrder })
        if (error) throw error
      }

      const refreshed = leaders.map((member, index) => ({ ...member, sort_order: index + 1 }))
      setLeaders(sortByDisplayOrder(refreshed))
      setStatus('Leader order saved.')
    } catch (error) {
      setStatus(error.message || 'Failed to save leader order')
    } finally {
      setSavingLeaderOrder(false)
    }
  }

  async function handleSaveExpertOrder() {
    setSavingExpertOrder(true)
    setStatus('')

    try {
      for (let index = 0; index < experts.length; index += 1) {
        const member = experts[index]
        const nextOrder = index + 1

        if (normalizeOrderValue(member.sort_order) === nextOrder) continue

        const { error } = await updateTeamPageExpert(member.id, { sort_order: nextOrder })
        if (error) throw error
      }

      const refreshed = experts.map((member, index) => ({ ...member, sort_order: index + 1 }))
      setExperts(sortByDisplayOrder(refreshed))
      setStatus('Expert order saved.')
    } catch (error) {
      setStatus(error.message || 'Failed to save expert order')
    } finally {
      setSavingExpertOrder(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading team panel...">
      <div className="admin-hero-panel refined-admin-hero">
          <div>
            <span className="auth-kicker"><Users size={16} /> Team management</span>
            <h1>Manage Leaders and Meet The Experts separately.</h1>
            <p>Leaders now support card-style profile info with social media links, while experts remain simple role cards.</p>
          </div>
          <div className="admin-top-actions">
            <Link href="/admin/case-studies" className="secondary-pill">Back to Dashboard</Link>
          </div>
        </div>

        {status ? <div className="form-status">{status}</div> : null}

        <div className="admin-team-layout-stack">
          {showLeaders ? (
            <>
            <div className="admin-list-card futuristic-card refined-admin-card">
              <div className="admin-card-head admin-order-head admin-section-head">
                <div>
                  <h2>Leaders Library</h2>
                  <span>Current featured leaders in display order</span>
                </div>
                <TeamOrderActions onSave={handleSaveLeaderOrder} saving={savingLeaderOrder} />
                <button type="button" className="admin-add-trigger" onClick={() => setShowAddLeaderModal(true)}><Plus size={16} /> Add Leader</button>
              </div>
              <div className="admin-study-list refined-admin-study-list">
                {leaders.map((member, index) => {
                  const isEditing = editingLeaderId === member.id

                  return (
                    <article key={member.id} className={`admin-team-item refined-admin-team-item ${isEditing ? 'editing' : ''}`}>
                      <div className="admin-team-mini refined-admin-team-mini">
                        <div className="admin-team-thumb">
                          {member.image_url ? <img src={member.image_url} alt={member.name} /> : <div className="admin-thumb-fallback">No image</div>}
                        </div>
                        {isEditing ? (
                          <div className="admin-team-edit-grid">
                            <label><span>Name</span><input value={editingLeaderForm.name} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, name: event.target.value }))} /></label>
                            <label><span>Role</span><input value={editingLeaderForm.role} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, role: event.target.value }))} /></label>
                            <label><span>Serial</span><input type="number" min="1" value={editingLeaderForm.sort_order} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, sort_order: event.target.value }))} /></label>
                            <ImageUrlField label="Image URL" value={editingLeaderForm.image_url} onChange={(url) => setEditingLeaderForm((current) => ({ ...current, image_url: url }))} />
                            <label className="full-width"><span>Description</span><textarea value={editingLeaderForm.description} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, description: event.target.value }))} /></label>
                            <label><span>LinkedIn</span><input value={editingLeaderForm.linkedin_url} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, linkedin_url: event.target.value }))} /></label>
                            <label><span>Facebook</span><input value={editingLeaderForm.facebook_url} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, facebook_url: event.target.value }))} /></label>
                            <label><span>Instagram</span><input value={editingLeaderForm.instagram_url} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, instagram_url: event.target.value }))} /></label>
                            <label><span>Twitter / X</span><input value={editingLeaderForm.twitter_url} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, twitter_url: event.target.value }))} /></label>
                            <label><span>Upwork</span><input value={editingLeaderForm.upwork_url} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, upwork_url: event.target.value }))} /></label>
                            <label><span>Website</span><input value={editingLeaderForm.website_url} onChange={(event) => setEditingLeaderForm((current) => ({ ...current, website_url: event.target.value }))} /></label>
                          </div>
                        ) : (
                          <div>
                            <strong>{index + 1}. {member.name}</strong>
                            <span>{member.role}</span>
                            <small>{member.description}</small>
                            <LeaderSocialPreview leader={member} />
                          </div>
                        )}
                      </div>
                      <div className="admin-team-controls">
                        <div className="admin-team-serial-badge">Serial {index + 1}</div>
                        {isEditing ? (
                          <div className="team-edit-actions">
                            <button type="button" className="team-edit-btn primary" onClick={() => handleLeaderEditSubmit(member.id)} disabled={savingEditedLeader}>
                              <Save size={15} /> {savingEditedLeader ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" className="team-edit-btn" onClick={cancelLeaderEdit} disabled={savingEditedLeader}>
                              <X size={15} /> Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="team-order-actions compact">
                              <button type="button" className="team-order-btn" onClick={() => setLeaders((current) => shiftItem(current, index, -1))} disabled={index === 0 || savingLeaderOrder} aria-label="Move up">
                                <ArrowUp size={16} />
                              </button>
                              <button type="button" className="team-order-btn" onClick={() => setLeaders((current) => shiftItem(current, index, 1))} disabled={index === leaders.length - 1 || savingLeaderOrder} aria-label="Move down">
                                <ArrowDown size={16} />
                              </button>
                            </div>
                            <button type="button" className="team-edit-btn" onClick={() => startLeaderEdit(member)}>
                              <Pencil size={15} /> Edit
                            </button>
                          </>
                        )}
                        <button type="button" className="admin-delete-btn" onClick={() => handleDeleteLeader(member.id)}>Delete</button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            <Modal open={showAddLeaderModal} onClose={() => setShowAddLeaderModal(false)} title="Add Leader">
              <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleLeaderSubmit}>
                <div className="admin-card-head">
                  <h2>Leaders</h2>
                  <span><Users size={15} /> Featured mentor section</span>
                </div>
                <div className="admin-form-grid">
                  <label><span>Name</span><input value={leaderForm.name} onChange={(event) => setLeaderForm((current) => ({ ...current, name: event.target.value }))} required /></label>
                  <label><span>Role</span><input value={leaderForm.role} onChange={(event) => setLeaderForm((current) => ({ ...current, role: event.target.value }))} required /></label>
                  <label><span>Serial / Order</span><input type="number" min="1" value={leaderForm.sort_order} onChange={(event) => setLeaderForm((current) => ({ ...current, sort_order: event.target.value }))} placeholder="1 = top" required /></label>
                  <div className="admin-order-hint">Lower serial shows first. Example: CEO = 1, COO = 2, CTO = 3.</div>
                  <label className="full-width"><span>Description</span><textarea value={leaderForm.description} onChange={(event) => setLeaderForm((current) => ({ ...current, description: event.target.value }))} required /></label>
                  <ImageUrlField label="Image URL" value={leaderForm.image_url} onChange={(url) => setLeaderForm((current) => ({ ...current, image_url: url }))} required />
                  <label><span>LinkedIn</span><input value={leaderForm.linkedin_url} onChange={(event) => setLeaderForm((current) => ({ ...current, linkedin_url: event.target.value }))} placeholder="https://linkedin.com/in/..." /></label>
                  <label><span>Facebook</span><input value={leaderForm.facebook_url} onChange={(event) => setLeaderForm((current) => ({ ...current, facebook_url: event.target.value }))} placeholder="https://facebook.com/..." /></label>
                  <label><span>Instagram</span><input value={leaderForm.instagram_url} onChange={(event) => setLeaderForm((current) => ({ ...current, instagram_url: event.target.value }))} placeholder="https://instagram.com/..." /></label>
                  <label><span>Twitter / X</span><input value={leaderForm.twitter_url} onChange={(event) => setLeaderForm((current) => ({ ...current, twitter_url: event.target.value }))} placeholder="https://x.com/..." /></label>
                  <label><span>Upwork</span><input value={leaderForm.upwork_url} onChange={(event) => setLeaderForm((current) => ({ ...current, upwork_url: event.target.value }))} placeholder="https://www.upwork.com/..." /></label>
                  <label><span>Website</span><input value={leaderForm.website_url} onChange={(event) => setLeaderForm((current) => ({ ...current, website_url: event.target.value }))} placeholder="https://..." /></label>
                </div>
                <button className="primary-pill large auth-submit" type="submit" disabled={savingLeader}>{savingLeader ? 'Saving...' : 'Add Leader'}</button>
              </form>
            </Modal>
            </>
          ) : null}

          {showExperts ? (
            <>
            <div className="admin-list-card futuristic-card refined-admin-card">
              <div className="admin-card-head admin-order-head admin-section-head">
                <div>
                  <h2>Experts Library</h2>
                  <span>Team-page-only expert cards in display order</span>
                </div>
                <TeamOrderActions onSave={handleSaveExpertOrder} saving={savingExpertOrder} />
                <button type="button" className="admin-add-trigger" onClick={() => setShowAddExpertModal(true)}><Plus size={16} /> Add Expert</button>
              </div>
              <div className="admin-study-list refined-admin-study-list expert-admin-grid">
                {experts.map((member, index) => {
                  const isEditing = editingExpertId === member.id

                  return (
                    <article key={member.id} className={`expert-admin-card ${isEditing ? 'editing' : ''}`}>
                      <div className="expert-admin-image-wrap">
                        {member.image_url ? <img src={member.image_url} alt={member.name} /> : <div className="admin-thumb-fallback">No image</div>}
                      </div>

                      {isEditing ? (
                        <div className="admin-team-edit-grid expert-edit-grid">
                          <label><span>Name</span><input value={editingExpertForm.name} onChange={(event) => setEditingExpertForm((current) => ({ ...current, name: event.target.value }))} /></label>
                          <label><span>Title</span><input value={editingExpertForm.title} onChange={(event) => setEditingExpertForm((current) => ({ ...current, title: event.target.value }))} /></label>
                          <label><span>Serial</span><input type="number" min="1" value={editingExpertForm.sort_order} onChange={(event) => setEditingExpertForm((current) => ({ ...current, sort_order: event.target.value }))} /></label>
                          <ImageUrlField label="Image URL" value={editingExpertForm.image_url} onChange={(url) => setEditingExpertForm((current) => ({ ...current, image_url: url }))} />
                        </div>
                      ) : (
                        <>
                          <strong>{index + 1}. {member.name}</strong>
                          <span>{member.title}</span>
                        </>
                      )}

                      <div className="admin-team-controls expert-controls">
                        <div className="admin-team-serial-badge">Serial {index + 1}</div>
                        {isEditing ? (
                          <div className="team-edit-actions stacked">
                            <button type="button" className="team-edit-btn primary" onClick={() => handleExpertEditSubmit(member.id)} disabled={savingEditedExpert}>
                              <Save size={15} /> {savingEditedExpert ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" className="team-edit-btn" onClick={cancelExpertEdit} disabled={savingEditedExpert}>
                              <X size={15} /> Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="team-order-actions compact">
                              <button type="button" className="team-order-btn" onClick={() => setExperts((current) => shiftItem(current, index, -1))} disabled={index === 0 || savingExpertOrder} aria-label="Move up">
                                <ArrowUp size={16} />
                              </button>
                              <button type="button" className="team-order-btn" onClick={() => setExperts((current) => shiftItem(current, index, 1))} disabled={index === experts.length - 1 || savingExpertOrder} aria-label="Move down">
                                <ArrowDown size={16} />
                              </button>
                            </div>
                            <button type="button" className="team-edit-btn" onClick={() => startExpertEdit(member)}>
                              <Pencil size={15} /> Edit
                            </button>
                          </>
                        )}
                        <button type="button" className="admin-delete-btn" onClick={() => handleDeleteExpert(member.id)}>Delete</button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            <Modal open={showAddExpertModal} onClose={() => setShowAddExpertModal(false)} title="Add Expert">
              <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleExpertSubmit}>
                <div className="admin-card-head">
                  <h2>Meet The Experts</h2>
                  <span><Users size={15} /> Team page grid only</span>
                </div>
                <div className="admin-form-grid">
                  <label><span>Name</span><input value={expertForm.name} onChange={(event) => setExpertForm((current) => ({ ...current, name: event.target.value }))} required /></label>
                  <label><span>Title</span><input value={expertForm.title} onChange={(event) => setExpertForm((current) => ({ ...current, title: event.target.value }))} required /></label>
                  <label><span>Serial / Order</span><input type="number" min="1" value={expertForm.sort_order} onChange={(event) => setExpertForm((current) => ({ ...current, sort_order: event.target.value }))} placeholder="1 = top" required /></label>
                  <div className="admin-order-hint">Use serial numbers to control exactly who appears first in the team page grid.</div>
                  <ImageUrlField label="Image URL" value={expertForm.image_url} onChange={(url) => setExpertForm((current) => ({ ...current, image_url: url }))} required />
                </div>
                <button className="primary-pill large auth-submit" type="submit" disabled={savingExpert}>{savingExpert ? 'Saving...' : 'Add Expert'}</button>
              </form>
            </Modal>
            </>
          ) : null}
        </div>
    </AdminShell>
  )
}
