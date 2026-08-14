import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------

export async function fetchGalleryCategories() {
  const { data, error } = await apiGet('/api/gallery-categories')
  if (error || !data) return []
  return data
}

export async function fetchGalleryImages() {
  const { data, error } = await apiGet('/api/gallery-images')
  if (error || !data) return []
  return data
}

// ---------------------------------------------------------------------------
// Admin: categories
// ---------------------------------------------------------------------------

export async function fetchAdminGalleryCategories() {
  const { data, error } = await apiGet('/api/admin/gallery-categories', { auth: true })
  if (error || !data) return []
  return data
}

export async function createGalleryCategory(payload) {
  return apiPost('/api/admin/gallery-categories', payload, { auth: true })
}

export async function updateGalleryCategory(id, payload) {
  return apiPut(`/api/admin/gallery-categories/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteGalleryCategory(id) {
  const { error } = await apiDelete(`/api/admin/gallery-categories/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}

// ---------------------------------------------------------------------------
// Admin: images
// ---------------------------------------------------------------------------

export async function fetchAdminGalleryImages() {
  const { data, error } = await apiGet('/api/admin/gallery-images', { auth: true })
  if (error || !data) return []
  return data
}

export async function createGalleryImage(payload) {
  return apiPost('/api/admin/gallery-images', payload, { auth: true })
}

export async function updateGalleryImage(id, payload) {
  return apiPut(`/api/admin/gallery-images/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteGalleryImage(id) {
  const { error } = await apiDelete(`/api/admin/gallery-images/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}
