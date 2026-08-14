import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

const fallbackTechnologyLogos = [
  { id: 'openai', name: 'OpenAI', image_url: 'https://cdn.simpleicons.org/openai/412991', published: true, sort_order: 1 },
  { id: 'make', name: 'Make', image_url: 'https://cdn.simpleicons.org/make/6D00CC', published: true, sort_order: 2 },
  { id: 'zapier', name: 'Zapier', image_url: 'https://cdn.simpleicons.org/zapier/FF4F00', published: true, sort_order: 3 },
  { id: 'n8n', name: 'n8n', image_url: 'https://cdn.simpleicons.org/n8n/EA4B71', published: true, sort_order: 4 },
  { id: 'supabase', name: 'Supabase', image_url: 'https://cdn.simpleicons.org/supabase/3ECF8E', published: true, sort_order: 5 },
  { id: 'google-cloud', name: 'Google Cloud', image_url: 'https://cdn.simpleicons.org/googlecloud/4285F4', published: true, sort_order: 6 },
  { id: 'meta', name: 'Meta', image_url: 'https://cdn.simpleicons.org/meta/0866FF', published: true, sort_order: 7 },
  { id: 'javascript', name: 'JavaScript', image_url: 'https://cdn.simpleicons.org/javascript/F7DF1E', published: true, sort_order: 8 },
  { id: 'python', name: 'Python', image_url: 'https://cdn.simpleicons.org/python/3776AB', published: true, sort_order: 9 },
  { id: 'docker', name: 'Docker', image_url: 'https://cdn.simpleicons.org/docker/2496ED', published: true, sort_order: 10 },
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

export async function fetchTechnologyLogos() {
  const { data, error } = await apiGet('/api/technology-logos')
  if (error || !data?.length) return sortItems(fallbackTechnologyLogos.filter((item) => item.published !== false))
  return sortItems(data)
}

export async function fetchAdminTechnologyLogos() {
  const { data, error } = await apiGet('/api/admin/technology-logos', { auth: true })
  if (error || !data) return sortItems(fallbackTechnologyLogos)
  return sortItems(data)
}

export async function createTechnologyLogo(payload) {
  return apiPost('/api/admin/technology-logos', payload, { auth: true })
}

export async function updateTechnologyLogo(id, payload) {
  return apiPut(`/api/admin/technology-logos/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteTechnologyLogo(id) {
  const { error } = await apiDelete(`/api/admin/technology-logos/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}
