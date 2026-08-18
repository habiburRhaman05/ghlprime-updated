'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Boxes, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import Modal from '../components/admin/Modal'
import { getSession, signOut } from '../lib/auth'
import { SHOWCASE_PAGES } from '../data/showcasePages'
import {
  createShowcaseItem,
  createShowcaseStat,
  deleteShowcaseItem,
  deleteShowcaseStat,
  fetchAdminShowcaseItems,
  fetchAdminShowcaseStats,
  updateShowcaseItem,
  updateShowcaseStat,
} from '../lib/showcaseApi'
import '../styles/admin-extras.css'

function emptyPlacements() {
  return SHOWCASE_PAGES.reduce((acc, page) => {
    acc[page.key] = { checked: false, order: 999 }
    return acc
  }, {})
}

const initialItemForm = {
  origin_name: '',
  origin_url: '',
  origin_icon: '',
  origin_description: '',
  origin_tagline: '',
  adaptation_badge: 'Enterprise Adaptation',
  adaptation_name: '',
  adaptation_description: '',
  adaptation_tags: '',
  sort_order: '999',
  published: true,
  placements: emptyPlacements(),
}

const initialStatForm = { value: '', label: '', sort_order: '999', published: true }

function mapItemToForm(item) {
  const placements = emptyPlacements()
  for (const pl of item.placements || []) {
    if (placements[pl.page_key]) {
      placements[pl.page_key] = { checked: pl.enabled !== false, order: pl.sort_order ?? 999 }
    }
  }
  const tags = Array.isArray(item.adaptation_tags)
    ? item.adaptation_tags.join('\n')
    : typeof item.adaptation_tags === 'string'
      ? item.adaptation_tags
      : ''
  return {
    origin_name: item.origin_name || '',
    origin_url: item.origin_url || '',
    origin_icon: item.origin_icon || '',
    origin_description: item.origin_description || '',
    origin_tagline: item.origin_tagline || '',
    adaptation_badge: item.adaptation_badge || 'Enterprise Adaptation',
    adaptation_name: item.adaptation_name || '',
    adaptation_description: item.adaptation_description || '',
    adaptation_tags: tags,
    sort_order: String(item.sort_order ?? 999),
    published: item.published !== false,
    placements,
  }
}

export default function AdminShowcasePage() {
  const [session, setSession] = useState(undefined)
  const [items, setItems] = useState([])
  const [stats, setStats] = useState([])
  const [itemForm, setItemForm] = useState(initialItemForm)
  const [editingItemId, setEditingItemId] = useState(null)
  const [statForm, setStatForm] = useState(initialStatForm)
  const [editingStatId, setEditingStatId] = useState(null)
  const [status, setStatus] = useState('')
  const [savingItem, setSavingItem] = useState(false)
  const [savingStat, setSavingStat] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showAddStatModal, setShowAddStatModal] = useState(false)

  useEffect(() => {
    getSession().then(setSession)
    fetchAdminShowcaseItems().then(setItems)
    fetchAdminShowcaseStats().then(setStats)
  }, [])

  const checkedCount = useMemo(
    () => SHOWCASE_PAGES.filter((page) => itemForm.placements[page.key]?.checked).length,
    [itemForm.placements],
  )

  function setItemField(field, value) {
    setItemForm((current) => ({ ...current, [field]: value }))
  }

  function togglePlacement(key) {
    setItemForm((current) => ({
      ...current,
      placements: {
        ...current.placements,
        [key]: { ...current.placements[key], checked: !current.placements[key].checked },
      },
    }))
  }

  function setPlacementOrder(key, value) {
    setItemForm((current) => ({
      ...current,
      placements: {
        ...current.placements,
        [key]: { ...current.placements[key], order: value },
      },
    }))
  }

  async function handleItemSubmit(event) {
    event.preventDefault()
    setSavingItem(true)
    setStatus('')

    const payload = {
      origin_name: itemForm.origin_name,
      origin_url: itemForm.origin_url,
      origin_icon: itemForm.origin_icon,
      origin_description: itemForm.origin_description,
      origin_tagline: itemForm.origin_tagline,
      adaptation_badge: itemForm.adaptation_badge,
      adaptation_name: itemForm.adaptation_name,
      adaptation_description: itemForm.adaptation_description,
      adaptation_tags: itemForm.adaptation_tags.split(/[\n,]/).map((t) => t.trim()).filter(Boolean),
      sort_order: Number(itemForm.sort_order || 999),
      published: itemForm.published,
      placements: SHOWCASE_PAGES.filter((page) => itemForm.placements[page.key]?.checked).map((page) => ({
        page_key: page.key,
        sort_order: Number(itemForm.placements[page.key].order) || 999,
        enabled: true,
      })),
    }

    const action = editingItemId ? updateShowcaseItem(editingItemId, payload) : createShowcaseItem(payload)
    const { data, error } = await action

    if (error) {
      setStatus(error.message || 'Failed to save showcase item')
      setSavingItem(false)
      return
    }

    if (editingItemId) {
      setItems((current) => current.map((item) => (item.id === editingItemId ? data : item)))
      setStatus('Showcase item updated.')
    } else {
      setItems((current) => [...current, data].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Showcase item created.')
    }

    setItemForm(initialItemForm)
    setEditingItemId(null)
    setSavingItem(false)
    setShowAddItemModal(false)
  }

  function startEditingItem(item) {
    setEditingItemId(item.id)
    setItemForm(mapItemToForm(item))
    setStatus('')
    setShowAddItemModal(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditingItem() {
    setEditingItemId(null)
    setItemForm(initialItemForm)
    setStatus('')
    setShowAddItemModal(false)
  }

  async function handleDeleteItem(id) {
    const { error } = await deleteShowcaseItem(id)
    if (error) {
      setStatus(error.message || 'Failed to delete showcase item')
      return
    }
    setItems((current) => current.filter((item) => item.id !== id))
    if (editingItemId === id) cancelEditingItem()
    setStatus('Showcase item deleted.')
  }

  async function handleStatSubmit(event) {
    event.preventDefault()
    setSavingStat(true)
    setStatus('')

    const payload = {
      value: statForm.value,
      label: statForm.label,
      sort_order: Number(statForm.sort_order || 999),
      published: statForm.published,
    }

    const action = editingStatId ? updateShowcaseStat(editingStatId, payload) : createShowcaseStat(payload)
    const { data, error } = await action

    if (error) {
      setStatus(error.message || 'Failed to save stat tile')
      setSavingStat(false)
      return
    }

    if (editingStatId) {
      setStats((current) => current.map((stat) => (stat.id === editingStatId ? data : stat)).sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Stat tile updated.')
    } else {
      setStats((current) => [...current, data].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999)))
      setStatus('Stat tile added.')
    }

    setStatForm(initialStatForm)
    setEditingStatId(null)
    setSavingStat(false)
    setShowAddStatModal(false)
  }

  function startEditingStat(stat) {
    setEditingStatId(stat.id)
    setStatForm({
      value: stat.value || '',
      label: stat.label || '',
      sort_order: String(stat.sort_order ?? 999),
      published: stat.published !== false,
    })
    setStatus('')
    setShowAddStatModal(true)
  }

  function cancelEditingStat() {
    setEditingStatId(null)
    setStatForm(initialStatForm)
    setStatus('')
    setShowAddStatModal(false)
  }

  async function handleDeleteStat(id) {
    const { error } = await deleteShowcaseStat(id)
    if (error) {
      setStatus(error.message || 'Failed to delete stat tile')
      return
    }
    setStats((current) => current.filter((stat) => stat.id !== id))
    if (editingStatId === id) cancelEditingStat()
    setStatus('Stat tile deleted.')
  }

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading showcase...">
      <div className="showcase-admin">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><Sparkles size={16} /> Shipped Evidence</span>
          <h1>Manage the showcase cards, stat bar, and where each card appears.</h1>
          <p>Add origin-to-enterprise pairs, then choose which pages show them (Homepage and each service page) and in what order.</p>
        </div>
        <div className="admin-top-actions">
          <Link href="/" className="secondary-pill">View Homepage</Link>
        </div>
      </div>

      {status ? <div className="form-status">{status}</div> : null}

      <div className="admin-list-card futuristic-card refined-admin-card">
        <div className="admin-card-head admin-section-head">
          <h2>Showcase Items</h2>
          <span>{items.length} total</span>
          <button type="button" className="admin-add-trigger" onClick={() => setShowAddItemModal(true)}><Plus size={16} /> Create Showcase Item</button>
        </div>
        <div className="admin-study-list refined-admin-study-list">
          {items.map((item) => {
            const placementCount = (item.placements || []).filter((pl) => pl.enabled !== false).length
            return (
              <article key={item.id} className="admin-study-item refined-admin-study-item">
                <div className="admin-study-copy">
                  <strong>{item.origin_name} to {item.adaptation_name}</strong>
                  <span>{placementCount} page{placementCount === 1 ? '' : 's'}</span>
                  <small>{item.published === false ? 'Draft' : 'Published'}</small>
                </div>
                <div className="admin-study-actions">
                  <button type="button" className="team-edit-btn" onClick={() => startEditingItem(item)}><Pencil size={15} /> Edit</button>
                  <button type="button" className="team-edit-btn admin-danger-btn" onClick={() => handleDeleteItem(item.id)}><Trash2 size={15} /> Delete</button>
                </div>
              </article>
            )
          })}
          {items.length === 0 ? <p className="admin-empty-note">No showcase items yet. Click “Create Showcase Item” to get started.</p> : null}
        </div>
      </div>

      <Modal open={showAddItemModal} onClose={() => setShowAddItemModal(false)} title={editingItemId ? 'Edit Showcase Item' : 'Create Showcase Item'}>
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleItemSubmit}>
          <div className="admin-card-head">
            <h2>{editingItemId ? 'Edit Showcase Item' : 'Create Showcase Item'}</h2>
            <span><Boxes size={15} /> Origin to enterprise pair</span>
          </div>

          <div className="admin-form-grid">
            <label><span>Origin name</span><input value={itemForm.origin_name} onChange={(e) => setItemField('origin_name', e.target.value)} required /></label>
            <label><span>Origin URL</span><input value={itemForm.origin_url} onChange={(e) => setItemField('origin_url', e.target.value)} placeholder="photofoxai.com" /></label>
            <label><span>Origin icon (emoji or image URL)</span><input value={itemForm.origin_icon} onChange={(e) => setItemField('origin_icon', e.target.value)} placeholder="Paste an emoji or an image URL" /></label>
            <label><span>Origin tagline</span><input value={itemForm.origin_tagline} onChange={(e) => setItemField('origin_tagline', e.target.value)} placeholder="Sketch to polished visual" /></label>
            <label className="full-width"><span>Origin description</span><textarea value={itemForm.origin_description} onChange={(e) => setItemField('origin_description', e.target.value)} /></label>
            <label><span>Adaptation badge</span><input value={itemForm.adaptation_badge} onChange={(e) => setItemField('adaptation_badge', e.target.value)} /></label>
            <label><span>Adaptation name</span><input value={itemForm.adaptation_name} onChange={(e) => setItemField('adaptation_name', e.target.value)} required /></label>
            <label className="full-width"><span>Adaptation description</span><textarea value={itemForm.adaptation_description} onChange={(e) => setItemField('adaptation_description', e.target.value)} /></label>
            <label className="full-width"><span>Adaptation tags (one per line or comma-separated)</span><textarea rows="3" value={itemForm.adaptation_tags} onChange={(e) => setItemField('adaptation_tags', e.target.value)} placeholder="ARCHITECTURE, REAL ESTATE" /></label>
            <label><span>Global sort order</span><input type="number" value={itemForm.sort_order} onChange={(e) => setItemField('sort_order', e.target.value)} /></label>
            <label className="checkbox-row"><input type="checkbox" checked={itemForm.published} onChange={(e) => setItemField('published', e.target.checked)} /><span>Published</span></label>

            <div className="full-width admin-team-assignment-box refined-assignment-box">
              <span>Appears on pages ({checkedCount} selected). Tick a page and set its order.</span>
              <div className="showcase-placement-grid">
                {SHOWCASE_PAGES.map((page) => {
                  const pl = itemForm.placements[page.key]
                  return (
                    <div key={page.key} className={`showcase-placement-row ${pl.checked ? 'is-on' : ''}`}>
                      <label className="team-assign-chip showcase-placement-chip">
                        <input type="checkbox" checked={pl.checked} onChange={() => togglePlacement(page.key)} />
                        <span>{page.label}</span>
                      </label>
                      <input
                        type="number"
                        className="showcase-order-input"
                        value={pl.order}
                        disabled={!pl.checked}
                        onChange={(e) => setPlacementOrder(page.key, e.target.value)}
                        aria-label={`${page.label} order`}
                        title="Order on this page"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="team-edit-actions admin-form-actions">
            <button className="primary-pill large auth-submit" type="submit" disabled={savingItem}>{savingItem ? 'Saving...' : editingItemId ? 'Save Changes' : 'Create Item'}</button>
            {editingItemId ? <button type="button" className="team-edit-btn" onClick={cancelEditingItem} disabled={savingItem}><X size={15} /> Cancel Edit</button> : null}
          </div>
        </form>
      </Modal>

      <div className="admin-list-card futuristic-card refined-admin-card admin-showcase-stats-grid">
        <div className="admin-card-head admin-section-head">
          <h2>Stat Tiles</h2>
          <span>{stats.length} total</span>
          <button type="button" className="admin-add-trigger" onClick={() => setShowAddStatModal(true)}><Plus size={16} /> Add Stat Tile</button>
        </div>
        <div className="admin-study-list refined-admin-study-list">
          {stats.map((stat) => (
            <article key={stat.id} className="admin-study-item refined-admin-study-item">
              <div className="admin-study-copy">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <small>{stat.published === false ? 'Hidden' : 'Visible'} | order {stat.sort_order ?? 999}</small>
              </div>
              <div className="admin-study-actions">
                <button type="button" className="team-edit-btn" onClick={() => startEditingStat(stat)}><Pencil size={15} /> Edit</button>
                <button type="button" className="team-edit-btn admin-danger-btn" onClick={() => handleDeleteStat(stat.id)}><Trash2 size={15} /> Delete</button>
              </div>
            </article>
          ))}
          {stats.length === 0 ? <p className="admin-empty-note">No stat tiles yet.</p> : null}
        </div>
      </div>

      <Modal open={showAddStatModal} onClose={() => setShowAddStatModal(false)} title={editingStatId ? 'Edit Stat Tile' : 'Add Stat Tile'}>
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleStatSubmit}>
          <div className="admin-card-head">
            <h2>{editingStatId ? 'Edit Stat Tile' : 'Add Stat Tile'}</h2>
            <span><BarChart3 size={15} /> Stat bar</span>
          </div>
          <div className="admin-form-grid">
            <label><span>Value</span><input value={statForm.value} onChange={(e) => setStatForm((c) => ({ ...c, value: e.target.value }))} placeholder="100K+" required /></label>
            <label><span>Label</span><input value={statForm.label} onChange={(e) => setStatForm((c) => ({ ...c, label: e.target.value }))} placeholder="USERS SERVED" required /></label>
            <label><span>Sort order</span><input type="number" value={statForm.sort_order} onChange={(e) => setStatForm((c) => ({ ...c, sort_order: e.target.value }))} /></label>
            <label className="checkbox-row"><input type="checkbox" checked={statForm.published} onChange={(e) => setStatForm((c) => ({ ...c, published: e.target.checked }))} /><span>Published</span></label>
          </div>
          <div className="team-edit-actions admin-form-actions">
            <button className="primary-pill large auth-submit" type="submit" disabled={savingStat}>{savingStat ? 'Saving...' : editingStatId ? 'Save Changes' : 'Add Stat'}</button>
            {editingStatId ? <button type="button" className="team-edit-btn" onClick={cancelEditingStat} disabled={savingStat}><X size={15} /> Cancel</button> : null}
          </div>
        </form>
      </Modal>
      </div>
    </AdminShell>
  )
}
