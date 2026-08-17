'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Pencil, Plus, Sparkles, Trash2, Eye, EyeOff } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import ImageUrlField from '../components/admin/ImageUrlField'
import Pagination from '../components/admin/Pagination'
import { getSession, signOut } from '../lib/auth'
import {
  createBlogPost,
  deleteBlogPost,
  fetchAdminBlogPosts,
  updateBlogPost,
} from '../lib/blogApi'

const POSTS_PER_PAGE = 15

const BLOG_CATEGORIES = [
  'GoHighLevel',
  'Automation',
  'AI Agents',
  'Case Studies',
  'Voice AI',
  'CRM',
  'Vibe Coding',
]

const initialForm = {
  title: '',
  slug: '',
  category: 'GoHighLevel',
  tags: '',
  author: 'GHL Prime Team',
  excerpt: '',
  cover_image: '',
  reading_time: '',
  content: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  featured: false,
  published: false,
}

function mapPostToForm(post) {
  return {
    title: post.title || '',
    slug: post.slug || '',
    category: post.category || 'GoHighLevel',
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
    author: post.author || 'GHL Prime Team',
    excerpt: post.excerpt || '',
    cover_image: post.cover_image || '',
    reading_time: post.reading_time != null ? String(post.reading_time) : '',
    content: post.content || '',
    seo_title: post.seo_title || '',
    seo_description: post.seo_description || '',
    seo_keywords: post.seo_keywords || '',
    featured: Boolean(post.featured),
    published: post.published === true,
  }
}

function formatBlogDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function countWords(html) {
  const text = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return 0
  return text.split(' ').length
}

export default function AdminBlogPage() {
  const [session, setSession] = useState(undefined)
  const [posts, setPosts] = useState([])
  const [view, setView] = useState('list') // 'list' | 'editor'
  const [form, setForm] = useState(initialForm)
  const [editingPostId, setEditingPostId] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    getSession().then(setSession)
    fetchAdminBlogPosts().then(setPosts)
  }, [])

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  // Derived during render (not an effect + setState) so a shrinking list
  // (e.g. after a delete) can't leave `page` pointing past the new last page.
  const currentPage = Math.min(page, totalPages)

  const paginatedPosts = useMemo(
    () => posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE),
    [posts, currentPage],
  )

  const previewSlug = useMemo(() => {
    if (form.slug) return form.slug
    return form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }, [form.slug, form.title])

  async function handleSignOut() {
    await signOut()
    setSession(null)
  }

  async function refreshPosts() {
    const data = await fetchAdminBlogPosts()
    setPosts(Array.isArray(data) ? data : [])
  }

  function startCreate() {
    setEditingPostId(null)
    setForm(initialForm)
    setStatus('')
    setView('editor')
  }

  function startEditing(post) {
    setEditingPostId(post.id)
    setForm(mapPostToForm(post))
    setStatus('')
    setView('editor')
  }

  function backToList() {
    setEditingPostId(null)
    setForm(initialForm)
    setView('list')
  }

  async function savePost(published) {
    if (!form.title.trim()) {
      setStatus('Title is required.')
      return
    }
    if (!previewSlug) {
      setStatus('Slug is required.')
      return
    }
    if (!form.excerpt.trim()) {
      setStatus('Excerpt is required.')
      return
    }

    setSaving(true)
    setStatus('')

    const tags = form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)

    let readingTime = parseInt(form.reading_time, 10)
    if (!form.reading_time || Number.isNaN(readingTime)) {
      readingTime = Math.max(1, Math.round(countWords(form.content) / 200))
    }

    const payload = {
      title: form.title,
      slug: previewSlug,
      category: form.category,
      tags,
      author: form.author || 'GHL Prime Team',
      excerpt: form.excerpt,
      cover_image: form.cover_image,
      reading_time: readingTime,
      content: form.content,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      seo_keywords: form.seo_keywords,
      featured: form.featured,
      published,
    }

    const action = editingPostId ? updateBlogPost(editingPostId, payload) : createBlogPost(payload)
    const { error } = await action

    if (error) {
      setStatus(error.message || `Failed to ${editingPostId ? 'update' : 'create'} post`)
      setSaving(false)
      return
    }

    await refreshPosts()
    setSaving(false)
    setStatus(editingPostId ? 'Post updated successfully.' : 'Post created successfully.')
    backToList()
  }

  async function togglePublish(post) {
    setStatus('')
    const { error } = await updateBlogPost(post.id, { published: !post.published })
    if (error) {
      setStatus(error.message || 'Failed to update publish status')
      return
    }
    await refreshPosts()
    setStatus(post.published ? 'Post unpublished.' : 'Post published.')
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    setStatus('')
    const { error } = await deleteBlogPost(post.id)
    if (error) {
      setStatus(error.message || 'Failed to delete post')
      return
    }
    await refreshPosts()
    setStatus('Post deleted.')
  }

  const excerptLen = form.excerpt.length
  const seoTitleLen = form.seo_title.length
  const seoDescLen = form.seo_description.length

  return (
    <AdminShell session={session} onSignOut={handleSignOut} loadingText="Loading blog posts...">
      <div className="admin-hero-panel refined-admin-hero">
        <div>
          <span className="auth-kicker"><Sparkles size={16} /> Blog</span>
          <h1>Write, publish, and manage blog posts from a dedicated section.</h1>
          <p>Draft and publish GoHighLevel guides, automation playbooks, and case study articles with full SEO control.</p>
        </div>
        <div className="admin-top-actions">
          <Link href="/blog" className="secondary-pill">View Public Page</Link>
        </div>
      </div>

      {status ? <div className="form-status">{status}</div> : null}

      {view === 'list' ? (
        <div className="admin-list-card futuristic-card refined-admin-card">
          <div className="admin-card-head">
            <h2>Blog Library</h2>
            <span className="admin-list-meta">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
            <button type="button" className="primary-pill" onClick={startCreate}><Plus size={16} /> New Post</button>
          </div>

          <div className="admin-blog-table-wrap">
            <table className="admin-blog-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr key={post.id || post.slug}>
                    <td><strong>{post.title}</strong></td>
                    <td>{post.category}</td>
                    <td>
                      <span className={`admin-blog-status-badge ${post.published ? 'published' : 'draft'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{post.featured ? 'Yes' : '·'}</td>
                    <td>{formatBlogDate(post.published_at || post.created_at)}</td>
                    <td>
                      <div className="admin-blog-row-actions">
                        <button type="button" className="team-edit-btn" onClick={() => startEditing(post)}><Pencil size={14} /> Edit</button>
                        <button type="button" className="team-edit-btn" onClick={() => togglePublish(post)}>
                          {post.published ? <><EyeOff size={14} /> Unpublish</> : <><Eye size={14} /> Publish</>}
                        </button>
                        <button type="button" className="team-edit-btn danger" onClick={() => handleDelete(post)}><Trash2 size={14} /> Delete</button>
                        <Link href={`/blog/${post.slug}`} className="text-link admin-open-link">Open <ExternalLink size={13} /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {!posts.length ? (
                  <tr><td colSpan={6} className="admin-blog-empty">No posts yet. Click “New Post” to get started.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : (
        <form className="admin-form-card futuristic-card refined-admin-card" onSubmit={(event) => { event.preventDefault(); savePost(form.published) }}>
          <div className="admin-card-head">
            <h2>{editingPostId ? 'Edit Post' : 'Create New Post'}</h2>
            <span>{editingPostId ? 'Update existing entry' : 'Publishing panel'}</span>
          </div>

          <div className="admin-form-grid">
            <label><span>Title</span><input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required /></label>
            <label><span>Slug</span><input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder={previewSlug} required /></label>
            <label>
              <span>Category</span>
              <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required>
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label><span>Tags (comma-separated)</span><input value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} placeholder="gohighlevel, automation" /></label>
            <label><span>Author</span><input value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} /></label>
            <label><span>Reading Time (minutes)</span><input type="number" min="1" value={form.reading_time} onChange={(event) => setForm((current) => ({ ...current, reading_time: event.target.value }))} placeholder="Auto from content if empty" /></label>
            <label className="full-width">
              <span>Excerpt <span className="char-counter">{excerptLen}/160</span></span>
              <textarea value={form.excerpt} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} required />
            </label>
            <ImageUrlField label="Cover Image URL" value={form.cover_image} onChange={(url) => setForm((current) => ({ ...current, cover_image: url }))} />
            <label className="full-width">
              <span>Post content paste HTML here. You can use any HTML editor (Notion export, Google Docs HTML, or a rich text editor) to generate the HTML first.</span>
              <textarea rows="16" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} />
            </label>
            <label className="full-width">
              <span>SEO Title <span className="char-counter">{seoTitleLen}/60</span></span>
              <input value={form.seo_title} onChange={(event) => setForm((current) => ({ ...current, seo_title: event.target.value }))} placeholder="Leave empty to use post title" />
            </label>
            <label className="full-width">
              <span>SEO Description <span className="char-counter">{seoDescLen}/160</span></span>
              <textarea value={form.seo_description} onChange={(event) => setForm((current) => ({ ...current, seo_description: event.target.value }))} placeholder="Leave empty to use excerpt" />
            </label>
            <label className="full-width"><span>SEO Keywords (comma-separated)</span><input value={form.seo_keywords} onChange={(event) => setForm((current) => ({ ...current, seo_keywords: event.target.value }))} /></label>
            <label className="checkbox-row"><input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} /><span>Featured</span></label>
            <label className="checkbox-row"><input type="checkbox" checked={form.published} onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))} /><span>Published</span></label>
          </div>

          <div className="team-edit-actions admin-form-actions">
            <button type="button" className="secondary-pill large" onClick={() => savePost(false)} disabled={saving}>{saving ? 'Saving...' : 'Save as Draft'}</button>
            <button type="button" className="primary-pill large auth-submit" onClick={() => savePost(true)} disabled={saving}>{saving ? 'Publishing...' : 'Publish'}</button>
            <button type="button" className="team-edit-btn" onClick={backToList} disabled={saving}>Back to list</button>
          </div>
        </form>
      )}
    </AdminShell>
  )
}
