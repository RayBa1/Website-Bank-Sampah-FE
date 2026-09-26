const API_BASE_URL = import.meta.env.VITE_API_URL

export const API = {
  register: `${API_BASE_URL}/nasabah/register`,
  login: `${API_BASE_URL}/auth/nasabah/login`,
  profile: `${API_BASE_URL}/nasabah/profile`,
  logout: `${API_BASE_URL}/auth/nasabah/logout`,
}


const NASABAH_TOKEN_KEY = 'nasabah_session_token'

export const getAccessToken = () => localStorage.getItem(NASABAH_TOKEN_KEY) || ''
export const setAccessToken = (token) => localStorage.setItem(NASABAH_TOKEN_KEY, token)
export const clearAccessToken = () => localStorage.removeItem(NASABAH_TOKEN_KEY)

export const getAuthHeaders = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function parseResponse(response) {
  const text = await response.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!response.ok) {
    const message = data?.message || data?.error || data?.detail || 'Permintaan ke server gagal.'
    throw new Error(message)
  }
  return data
}
