import { blogPosts } from '../data/blogPosts'
import contentSnapshot from '../data/contentSnapshot.json'
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

const FALLBACK_POSTS = Array.isArray(contentSnapshot.blogPosts) && contentSnapshot.blogPosts.length
  ? contentSnapshot.blogPosts
  : blogPosts

async function refreshSitemap() {
  try {
    const response = await fetch('/api/refresh-sitemap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const body = await response.text()
      console.warn('Sitemap refresh failed:', body)
    }
  } catch (error) {
    console.warn('Sitemap refresh request failed:', error)
  }
}

function sortByPublishedAtDesc(posts) {
  return [...posts].sort((a, b) => {
    const aTime = a.published_at ? new Date(a.published_at).getTime() : 0
    const bTime = b.published_at ? new Date(b.published_at).getTime() : 0
    return bTime - aTime
  })
}

function fallbackPublishedPosts() {
  return sortByPublishedAtDesc(FALLBACK_POSTS.filter((post) => post.published !== false))
}

export async function fetchBlogPosts() {
  const { data, error } = await apiGet('/api/blog-posts')
  if (error || !data) return fallbackPublishedPosts()
  return data
}

export async function fetchBlogPostBySlug(slug) {
  const { data, error } = await apiGet(`/api/blog-posts/${encodeURIComponent(slug)}`)

  if (error || !data) {
    return FALLBACK_POSTS.find((post) => post.slug === slug) ?? null
  }

  return data
}

export async function fetchRelatedPosts(category, excludeSlug, limit = 3) {
  const params = new URLSearchParams({ category: category || '', excludeSlug: excludeSlug || '', limit: String(limit) })
  const { data, error } = await apiGet(`/api/blog-posts/related?${params.toString()}`)

  if (error || !data) {
    return fallbackPublishedPosts()
      .filter((post) => post.category === category && post.slug !== excludeSlug)
      .slice(0, limit)
  }

  return data
}

export async function fetchAdminBlogPosts() {
  const { data, error } = await apiGet('/api/admin/blog-posts', { auth: true })

  if (error || !data) {
    return [...FALLBACK_POSTS].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
      return bTime - aTime
    })
  }

  return data
}

export async function createBlogPost(payload) {
  const blogPayload = { ...payload }
  if (blogPayload.published === true && !blogPayload.published_at) {
    blogPayload.published_at = new Date().toISOString()
  }

  const { data, error } = await apiPost('/api/admin/blog-posts', blogPayload, { auth: true })

  if (!error) await refreshSitemap()
  return { data, error }
}

export async function updateBlogPost(id, payload) {
  const blogPayload = { ...payload }
  if (blogPayload.published === true && !blogPayload.published_at) {
    blogPayload.published_at = new Date().toISOString()
  }

  const { data, error } = await apiPut(`/api/admin/blog-posts/${encodeURIComponent(id)}`, blogPayload, { auth: true })

  if (!error) await refreshSitemap()
  return { data, error }
}

export async function deleteBlogPost(id) {
  const { error } = await apiDelete(`/api/admin/blog-posts/${encodeURIComponent(id)}`, { auth: true })

  if (!error) await refreshSitemap()
  return { error }
}
