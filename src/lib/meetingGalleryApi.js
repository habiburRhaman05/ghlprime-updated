import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

const fallbackMeetingGallery = [
  {
    id: 'meeting-1',
    title: 'Client strategy session',
    image_url: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/j53xn6YJHwIdPImV00rn/media/67c6ef-example-meeting-1.png',
    sort_order: 1,
    published: true,
  },
  {
    id: 'meeting-2',
    title: 'Growth planning call',
    image_url: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/j53xn6YJHwIdPImV00rn/media/67c6ef-example-meeting-2.png',
    sort_order: 2,
    published: true,
  },
  {
    id: 'meeting-3',
    title: 'Workflow review meeting',
    image_url: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/j53xn6YJHwIdPImV00rn/media/67c6ef-example-meeting-3.png',
    sort_order: 3,
    published: true,
  },
]

function sortItems(items = []) {
  return [...items].sort((a, b) => {
    const orderA = Number(a.sort_order ?? 999)
    const orderB = Number(b.sort_order ?? 999)
    if (orderA !== orderB) return orderA - orderB

    const createdA = a.created_at ? new Date(a.created_at).getTime() : 0
    const createdB = b.created_at ? new Date(b.created_at).getTime() : 0
    return createdA - createdB
  })
}

export async function fetchMeetingGallery() {
  const { data, error } = await apiGet('/api/meeting-gallery')
  if (error || !data?.length) return sortItems(fallbackMeetingGallery.filter((item) => item.published !== false))
  return sortItems(data)
}

export async function fetchAdminMeetingGallery() {
  const { data, error } = await apiGet('/api/admin/meeting-gallery', { auth: true })
  if (error || !data) return sortItems(fallbackMeetingGallery)
  return sortItems(data)
}

export async function createMeetingGalleryItem(payload) {
  return apiPost('/api/admin/meeting-gallery', payload, { auth: true })
}

export async function updateMeetingGalleryItem(id, payload) {
  return apiPut(`/api/admin/meeting-gallery/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteMeetingGalleryItem(id) {
  const { error } = await apiDelete(`/api/admin/meeting-gallery/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}
