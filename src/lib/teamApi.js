import { teamMembers } from '../data/teamMembers'
import { apiGet, apiPost, apiPut, apiDelete } from './apiClient'

function normalizeSortOrder(value, fallback = 999) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function sortByDisplayOrder(items = []) {
  return [...items].sort((a, b) => {
    const sortDiff = normalizeSortOrder(a.sort_order) - normalizeSortOrder(b.sort_order)
    if (sortDiff !== 0) return sortDiff

    const createdAtA = a.created_at ? new Date(a.created_at).getTime() : 0
    const createdAtB = b.created_at ? new Date(b.created_at).getTime() : 0
    return createdAtA - createdAtB
  })
}

function fallbackExperts() {
  return []
}

export async function fetchTeamMembers() {
  const { data, error } = await apiGet('/api/team-members')
  if (error || !data) return sortByDisplayOrder(teamMembers)
  return sortByDisplayOrder(data)
}

export async function createTeamMember(payload) {
  return apiPost('/api/admin/team-members', payload, { auth: true })
}

export async function updateTeamMember(id, payload) {
  return apiPut(`/api/admin/team-members/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteTeamMember(id) {
  const { error } = await apiDelete(`/api/admin/team-members/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}

export async function fetchTeamPageExperts() {
  const { data, error } = await apiGet('/api/team-page-members')
  if (error || !data) return fallbackExperts()
  return sortByDisplayOrder(data)
}

export async function createTeamPageExpert(payload) {
  return apiPost('/api/admin/team-page-members', payload, { auth: true })
}

export async function updateTeamPageExpert(id, payload) {
  return apiPut(`/api/admin/team-page-members/${encodeURIComponent(id)}`, payload, { auth: true })
}

export async function deleteTeamPageExpert(id) {
  const { error } = await apiDelete(`/api/admin/team-page-members/${encodeURIComponent(id)}`, { auth: true })
  return { error }
}
