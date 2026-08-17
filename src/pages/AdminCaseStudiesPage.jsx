'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Pencil, Plus, Sparkles, X } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import ImageUrlField from '../components/admin/ImageUrlField'
import Modal from '../components/admin/Modal'
import Pagination from '../components/admin/Pagination'
import { createCaseStudy, fetchAdminCaseStudies, updateCaseStudy } from '../lib/caseStudiesApi'
import { getSession, signOut } from '../lib/auth'
import { fetchTeamMembers } from '../lib/teamApi'

const STUDIES_PER_PAGE = 10

const initialForm = {
  title: '',
  slug: '',
  category: 'Automation',
  subtitle: '',
  challenge: '',
  solution: '',
  outcome: '',
  excerpt: '',
  image: '',
  accent: 'emerald',
  bodyText: '',
  featured: false,
  published: true,
  teamMemberIds: [],
}

function mapStudyToForm(study) {
  return {
    title: study.title || '',
    slug: study.slug || '',
    category: study.category || 'Automation',
    subtitle: study.subtitle || '',
    challenge: study.challenge || '',
    solution: study.solution || '',
    outcome: study.outcome || '',
    excerpt: study.excerpt || '',
    image: study.image || '',
    accent: study.accent || 'emerald',
    bodyText: Array.isArray(study.body) ? study.body.join('\n') : '',
    featured: Boolean(study.featured),
    published: study.published !== false,
    teamMemberIds: (study.assigned_team_members || []).map((item) => item.team_member?.id).filter(Boolean),
  }
}

export default function AdminCaseStudiesPage() {
  const [session, setSession] = useState(undefined)
  const [studies, setStudies] = useState([])
  const [studiesPage, setStudiesPage] = useState(1)
  const studiesTotalPages = Math.max(1, Math.ceil(studies.length / STUDIES_PER_PAGE))
  const studiesCurrentPage = Math.min(studiesPage, studiesTotalPages)
  const [team, setTeam] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingStudyId, setEditingStudyId] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    getSession().then(setSession)
    fetchAdminCaseStudies().then(setStudies)
    fetchTeamMembers().then(setTeam)
  }, [])

  const previewSlug = useMemo(() => {
    if (form.slug) return form.slug
    return form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }, [form.slug, form.title])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setStatus('')

    const payload = {
      title: form.title,
      slug: previewSlug,
      category: form.category,
      subtitle: form.subtitle,
      challenge: form.challenge,
      solution: form.solution,
      outcome: form.outcome,
      excerpt: form.excerpt,
      image: form.image,
      accent: form.accent,
      body: form.bodyText.split('\n').map((item) => item.trim()).filter(Boolean),
      featured: form.featured,
      published: form.published,
      teamMemberIds: form.teamMemberIds,
    }

    const action = editingStudyId ? updateCaseStudy(editingStudyId, payload) : createCaseStudy(payload)
    const { data, error } = await action

    if (error) {
      setStatus(error.message || `Failed to ${editingStudyId ? 'update' : 'create'} case study`)
      setSaving(false)
      return
    }

    if (editingStudyId) {
      setStudies((current) => current.map((study) => (study.id === editingStudyId ? data : study)))
      setStatus('Case study updated successfully.')
    } else {
      setStudies((current) => [data, ...current])
      setStatus('Case study created successfully.')
    }

    setForm(initialForm)
    setEditingStudyId(null)
    setSaving(false)
    setShowAddModal(false)
  }

  function toggleTeamMember(id) {
    setForm((current) => ({
      ...current,
      teamMemberIds: current.teamMemberIds.includes(id)
        ? current.teamMemberIds.filter((item) => item !== id)
        : [...current.teamMemberIds, id],
    }))
  }

  function startEditingStudy(study) {
    setEditingStudyId(study.id)
    setForm(mapStudyToForm(study))
    setStatus('')
    setShowAddModal(true)
  }

  function cancelEditingStudy() {
    setEditingStudyId(null)
    setForm(initialForm)
    setStatus('')
    setShowAddModal(false)
  }

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading case studies...">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><Sparkles size={16} /> Case Studies</span>
          <h1>Create and manage case studies from a dedicated section.</h1>
          <p>Focused workflow for publishing, editing, and assigning team members without mixing it with other admin tools.</p>
        </div>
        <div className="admin-top-actions">
          <Link href="/case-studies" className="secondary-pill">View Public Page</Link>
        </div>
      </div>

      {status ? <div className="form-status">{status}</div> : null}

      <div className="admin-list-card futuristic-card refined-admin-card">
        <div className="admin-card-head admin-section-head">
          <h2>Case Study Library</h2>
          <span className="admin-list-meta">{studies.length} {studies.length === 1 ? 'study' : 'studies'}</span>
          <button type="button" className="admin-add-trigger" onClick={() => setShowAddModal(true)}><Plus size={16} /> Create Case Study</button>
        </div>
        <div className="admin-study-list refined-admin-study-list">
          {studies.slice((studiesCurrentPage - 1) * STUDIES_PER_PAGE, studiesCurrentPage * STUDIES_PER_PAGE).map((study) => (
            <article key={study.id || study.slug} className="admin-study-item refined-admin-study-item">
              <div className="admin-study-preview-thumb">{study.image ? <img src={study.image} alt={study.title} /> : <div className="admin-thumb-fallback">No image</div>}</div>
              <div className="admin-study-copy"><strong>{study.title}</strong><span>{study.category}</span><small>{study.published === false ? 'Draft' : 'Published'}</small></div>
              <div className="admin-study-actions">
                <button type="button" className="team-edit-btn" onClick={() => startEditingStudy(study)}><Pencil size={15} /> Edit</button>
                <Link href={`/case-studies/${study.slug}`} className="text-link admin-open-link">Open <ExternalLink size={14} /></Link>
              </div>
            </article>
          ))}
        </div>

        <Pagination page={studiesCurrentPage} totalPages={studiesTotalPages} onPageChange={setStudiesPage} />
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title={editingStudyId ? 'Edit Case Study' : 'Create New Case Study'}>
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleSubmit}>
          <div className="admin-card-head">
            <h2>{editingStudyId ? 'Edit Case Study' : 'Create New Case Study'}</h2>
            <span>{editingStudyId ? 'Update existing entry' : 'Publishing panel'}</span>
          </div>

          <div className="admin-form-grid">
            <label><span>Title</span><input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required /></label>
            <label><span>Slug (optional)</span><input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder={previewSlug} /></label>
            <label><span>Category</span><input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required /></label>
            <label><span>Subtitle</span><input value={form.subtitle} onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))} /></label>
            <label><span>Challenge</span><textarea value={form.challenge} onChange={(event) => setForm((current) => ({ ...current, challenge: event.target.value }))} required /></label>
            <label><span>Solution</span><textarea value={form.solution} onChange={(event) => setForm((current) => ({ ...current, solution: event.target.value }))} required /></label>
            <label><span>Outcome</span><textarea value={form.outcome} onChange={(event) => setForm((current) => ({ ...current, outcome: event.target.value }))} required /></label>
            <label><span>Excerpt</span><textarea value={form.excerpt} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} required /></label>
            <ImageUrlField label="Image URL" value={form.image} onChange={(url) => setForm((current) => ({ ...current, image: url }))} required />
            <label><span>Accent</span><input value={form.accent} onChange={(event) => setForm((current) => ({ ...current, accent: event.target.value }))} /></label>
            <label className="full-width"><span>Body paragraphs (one paragraph per line)</span><textarea rows="8" value={form.bodyText} onChange={(event) => setForm((current) => ({ ...current, bodyText: event.target.value }))} /></label>
            <div className="full-width admin-team-assignment-box refined-assignment-box">
              <span>Assign Team Members</span>
              <div className="team-checkbox-grid">
                {team.map((member) => (
                  <label key={member.id} className="team-assign-chip">
                    <input type="checkbox" checked={form.teamMemberIds.includes(member.id)} onChange={() => toggleTeamMember(member.id)} />
                    <span>{member.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="checkbox-row"><input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} /><span>Featured</span></label>
            <label className="checkbox-row"><input type="checkbox" checked={form.published} onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))} /><span>Published</span></label>
          </div>

          <div className="team-edit-actions admin-form-actions">
            <button className="primary-pill large auth-submit" type="submit" disabled={saving}>{saving ? (editingStudyId ? 'Saving...' : 'Publishing...') : (editingStudyId ? 'Save Changes' : 'Publish Case Study')}</button>
            {editingStudyId ? <button type="button" className="team-edit-btn" onClick={cancelEditingStudy} disabled={saving}><X size={15} /> Cancel Edit</button> : null}
          </div>
        </form>
      </Modal>
    </AdminShell>
  )
}
