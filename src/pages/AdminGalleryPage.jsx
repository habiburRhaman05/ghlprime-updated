'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderPlus, Image as ImageIcon, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import ImageUrlField from '../components/admin/ImageUrlField'
import Modal from '../components/admin/Modal'
import { getSession, signOut } from '../lib/auth'
import {
  createGalleryCategory,
  createGalleryImage,
  deleteGalleryCategory,
  deleteGalleryImage,
  fetchAdminGalleryCategories,
  fetchAdminGalleryImages,
  updateGalleryCategory,
  updateGalleryImage,
} from '../lib/galleryApi'
import '../styles/admin-extras.css'

const initialCategoryForm = { name: '', slug: '', sort_order: '999', published: true }
const initialImageForm = { title: '', image_url: '', category_id: '', sort_order: '999', published: true }

function slugify(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function bySort(a, b) {
  return (a.sort_order ?? 999) - (b.sort_order ?? 999)
}

export default function AdminGalleryPage() {
  const [session, setSession] = useState(undefined)
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [imageForm, setImageForm] = useState(initialImageForm)
  const [editingImageId, setEditingImageId] = useState(null)
  const [status, setStatus] = useState('')
  const [savingCategory, setSavingCategory] = useState(false)
  const [savingImage, setSavingImage] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showAddImageModal, setShowAddImageModal] = useState(false)

  useEffect(() => {
    getSession().then(setSession)
    fetchAdminGalleryCategories().then(setCategories)
    fetchAdminGalleryImages().then(setImages)
  }, [])

  function categoryName(id) {
    const match = categories.find((cat) => cat.id === id)
    return match ? match.name : 'Uncategorized'
  }

  async function handleCategorySubmit(event) {
    event.preventDefault()
    setSavingCategory(true)
    setStatus('')

    const payload = {
      name: categoryForm.name,
      slug: slugify(categoryForm.slug || categoryForm.name),
      sort_order: Number(categoryForm.sort_order || 999),
      published: categoryForm.published,
    }

    const action = editingCategoryId ? updateGalleryCategory(editingCategoryId, payload) : createGalleryCategory(payload)
    const { data, error } = await action

    if (error) {
      setStatus(error.message || 'Failed to save category')
      setSavingCategory(false)
      return
    }

    if (editingCategoryId) {
      setCategories((current) => current.map((cat) => (cat.id === editingCategoryId ? data : cat)).sort(bySort))
      setStatus('Category updated.')
    } else {
      setCategories((current) => [...current, data].sort(bySort))
      setStatus('Category added.')
    }

    setCategoryForm(initialCategoryForm)
    setEditingCategoryId(null)
    setSavingCategory(false)
    setShowAddCategoryModal(false)
  }

  function startEditingCategory(cat) {
    setEditingCategoryId(cat.id)
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      sort_order: String(cat.sort_order ?? 999),
      published: cat.published !== false,
    })
    setStatus('')
    setShowAddCategoryModal(true)
  }

  function cancelEditingCategory() {
    setEditingCategoryId(null)
    setCategoryForm(initialCategoryForm)
    setStatus('')
    setShowAddCategoryModal(false)
  }

  async function handleDeleteCategory(id) {
    const { error } = await deleteGalleryCategory(id)
    if (error) {
      setStatus(error.message || 'Failed to delete category')
      return
    }
    setCategories((current) => current.filter((cat) => cat.id !== id))
    if (editingCategoryId === id) cancelEditingCategory()
    setStatus('Category deleted.')
  }

  async function handleImageSubmit(event) {
    event.preventDefault()
    setSavingImage(true)
    setStatus('')

    const payload = {
      title: imageForm.title,
      image_url: imageForm.image_url,
      category_id: imageForm.category_id || null,
      sort_order: Number(imageForm.sort_order || 999),
      published: imageForm.published,
    }

    const action = editingImageId ? updateGalleryImage(editingImageId, payload) : createGalleryImage(payload)
    const { data, error } = await action

    if (error) {
      setStatus(error.message || 'Failed to save image')
      setSavingImage(false)
      return
    }

    if (editingImageId) {
      setImages((current) => current.map((img) => (img.id === editingImageId ? data : img)).sort(bySort))
      setStatus('Image updated.')
    } else {
      setImages((current) => [...current, data].sort(bySort))
      setStatus('Image added.')
    }

    setImageForm(initialImageForm)
    setEditingImageId(null)
    setSavingImage(false)
    setShowAddImageModal(false)
  }

  function startEditingImage(img) {
    setEditingImageId(img.id)
    setImageForm({
      title: img.title || '',
      image_url: img.image_url || '',
      category_id: img.category_id || '',
      sort_order: String(img.sort_order ?? 999),
      published: img.published !== false,
    })
    setStatus('')
    setShowAddImageModal(true)
  }

  function cancelEditingImage() {
    setEditingImageId(null)
    setImageForm(initialImageForm)
    setStatus('')
    setShowAddImageModal(false)
  }

  async function handleDeleteImage(id) {
    const { error } = await deleteGalleryImage(id)
    if (error) {
      setStatus(error.message || 'Failed to delete image')
      return
    }
    setImages((current) => current.filter((img) => img.id !== id))
    if (editingImageId === id) cancelEditingImage()
    setStatus('Image deleted.')
  }

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading gallery...">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><Sparkles size={16} /> Gallery</span>
          <h1>Manage gallery categories and images.</h1>
          <p>Categories become the filter tabs on the public gallery. Add images by pasting an image URL and assigning a category.</p>
        </div>
        <div className="admin-top-actions">
          <Link href="/gallery" className="secondary-pill">View Gallery</Link>
        </div>
      </div>

      {status ? <div className="form-status">{status}</div> : null}

      <div className="admin-list-card futuristic-card refined-admin-card">
        <div className="admin-card-head admin-section-head">
          <h2>Categories</h2>
          <span>{categories.length} total</span>
          <button type="button" className="admin-add-trigger" onClick={() => setShowAddCategoryModal(true)}><Plus size={16} /> Add Category</button>
        </div>
        <div className="admin-study-list refined-admin-study-list">
          {categories.map((cat) => (
            <article key={cat.id} className="admin-study-item refined-admin-study-item">
              <div className="admin-study-copy">
                <strong>{cat.name}</strong>
                <span>{cat.slug}</span>
                <small>{cat.published === false ? 'Hidden' : 'Visible'} | order {cat.sort_order ?? 999}</small>
              </div>
              <div className="admin-study-actions">
                <button type="button" className="team-edit-btn" onClick={() => startEditingCategory(cat)}><Pencil size={15} /> Edit</button>
                <button type="button" className="team-edit-btn admin-danger-btn" onClick={() => handleDeleteCategory(cat.id)}><Trash2 size={15} /> Delete</button>
              </div>
            </article>
          ))}
          {categories.length === 0 ? <p className="admin-empty-note">No categories yet.</p> : null}
        </div>
      </div>

      <Modal open={showAddCategoryModal} onClose={() => setShowAddCategoryModal(false)} title={editingCategoryId ? 'Edit Category' : 'Add Category'}>
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleCategorySubmit}>
          <div className="admin-card-head">
            <h2>{editingCategoryId ? 'Edit Category' : 'Add Category'}</h2>
            <span><FolderPlus size={15} /> Filter tab</span>
          </div>
          <div className="admin-form-grid">
            <label><span>Name</span><input value={categoryForm.name} onChange={(e) => setCategoryForm((c) => ({ ...c, name: e.target.value }))} placeholder="Events" required /></label>
            <label><span>Slug (optional)</span><input value={categoryForm.slug} onChange={(e) => setCategoryForm((c) => ({ ...c, slug: e.target.value }))} placeholder={slugify(categoryForm.name) || 'events'} /></label>
            <label><span>Sort order</span><input type="number" value={categoryForm.sort_order} onChange={(e) => setCategoryForm((c) => ({ ...c, sort_order: e.target.value }))} /></label>
            <label className="checkbox-row"><input type="checkbox" checked={categoryForm.published} onChange={(e) => setCategoryForm((c) => ({ ...c, published: e.target.checked }))} /><span>Published</span></label>
          </div>
          <div className="team-edit-actions admin-form-actions">
            <button className="primary-pill large auth-submit" type="submit" disabled={savingCategory}>{savingCategory ? 'Saving...' : editingCategoryId ? 'Save Changes' : 'Add Category'}</button>
            {editingCategoryId ? <button type="button" className="team-edit-btn" onClick={cancelEditingCategory} disabled={savingCategory}><X size={15} /> Cancel</button> : null}
          </div>
        </form>
      </Modal>

      <div className="admin-list-card futuristic-card refined-admin-card admin-showcase-stats-grid">
        <div className="admin-card-head admin-section-head">
          <h2>Images</h2>
          <span>{images.length} total</span>
          <button type="button" className="admin-add-trigger" onClick={() => setShowAddImageModal(true)}><Plus size={16} /> Add Image</button>
        </div>
        <div className="admin-study-list refined-admin-study-list">
          {images.map((img) => (
            <article key={img.id} className="admin-study-item refined-admin-study-item">
              <div className="admin-study-preview-thumb">{img.image_url ? <img src={img.image_url} alt={img.title || ''} onError={(e) => { e.currentTarget.style.display = 'none' }} /> : <div className="admin-thumb-fallback">No image</div>}</div>
              <div className="admin-study-copy">
                <strong>{img.title || 'Untitled'}</strong>
                <span className="admin-cat-pill">{categoryName(img.category_id)}</span>
                <small>{img.published === false ? 'Hidden' : 'Visible'} | order {img.sort_order ?? 999}</small>
              </div>
              <div className="admin-study-actions">
                <button type="button" className="team-edit-btn" onClick={() => startEditingImage(img)}><Pencil size={15} /> Edit</button>
                <button type="button" className="team-edit-btn admin-danger-btn" onClick={() => handleDeleteImage(img.id)}><Trash2 size={15} /> Delete</button>
              </div>
            </article>
          ))}
          {images.length === 0 ? <p className="admin-empty-note">No images yet. Click “Add Image” to get started.</p> : null}
        </div>
      </div>

      <Modal open={showAddImageModal} onClose={() => setShowAddImageModal(false)} title={editingImageId ? 'Edit Image' : 'Add Image'}>
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={handleImageSubmit}>
          <div className="admin-card-head">
            <h2>{editingImageId ? 'Edit Image' : 'Add Image'}</h2>
            <span><ImageIcon size={15} /> Paste an image URL</span>
          </div>
          <div className="admin-form-grid">
            <label><span>Title (optional)</span><input value={imageForm.title} onChange={(e) => setImageForm((c) => ({ ...c, title: e.target.value }))} placeholder="Team offsite" /></label>
            <ImageUrlField label="Image URL" value={imageForm.image_url} onChange={(url) => setImageForm((c) => ({ ...c, image_url: url }))} required />
            <label><span>Category</span>
              <select value={imageForm.category_id} onChange={(e) => setImageForm((c) => ({ ...c, category_id: e.target.value }))}>
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>
            <label><span>Sort order</span><input type="number" value={imageForm.sort_order} onChange={(e) => setImageForm((c) => ({ ...c, sort_order: e.target.value }))} /></label>
            <label className="checkbox-row"><input type="checkbox" checked={imageForm.published} onChange={(e) => setImageForm((c) => ({ ...c, published: e.target.checked }))} /><span>Published</span></label>
          </div>
          <div className="team-edit-actions admin-form-actions">
            <button className="primary-pill large auth-submit" type="submit" disabled={savingImage}>{savingImage ? 'Saving...' : editingImageId ? 'Save Changes' : 'Add Image'}</button>
            {editingImageId ? <button type="button" className="team-edit-btn" onClick={cancelEditingImage} disabled={savingImage}><X size={15} /> Cancel</button> : null}
          </div>
        </form>
      </Modal>
    </AdminShell>
  )
}
