import axios from 'axios'

// If VITE_API_URL is set (Option B: separate subdomains), use it as an
// absolute base URL and send cookies cross-origin via withCredentials.
// If it's unset (Option A: Netlify proxy, or local dev via Vite proxy),
// use a relative "/api" path — same-origin, no withCredentials needed.
const remoteBaseUrl = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: remoteBaseUrl || '/api',
  withCredentials: Boolean(remoteBaseUrl),
})

let accessToken = null // memory only, never localStorage

export const setToken = (t) => (accessToken = t)
export const getToken = () => accessToken

api.interceptors.request.use((cfg) => {
  const isAuthRoute = cfg.url?.startsWith('/auth/')
  if (accessToken && !isAuthRoute) cfg.headers.Authorization = `Bearer ${accessToken}`
  return cfg
})

// On a 401, try refreshing the session once via the httpOnly cookie,
// then replay the original request. Avoids logging the user out just
// because the short-lived access token expired mid-session.
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    const isAuthRoute = original?.url?.startsWith('/auth/')
    if (err.response?.status === 401 && !original?._retried && !isAuthRoute) {
      original._retried = true
      const ok = await restoreSession()
      if (ok) {
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      }
    }
    return Promise.reject(err)
  },
)

// Call once when the app starts, to silently restore a session from the
// refresh cookie (if any). Returns true/false so callers can decide what
// to show while that's pending.
export async function restoreSession() {
  try {
    const { data } = await api.post('/auth/refresh')
    setToken(data.jwt)
    return true
  } catch {
    setToken(null)
    return false
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } finally {
    setToken(null)
  }
}
//  AUTRE MANIERE DE FAIRE
// // api.js
// export const publicApi = axios.create({ baseURL: remoteBaseUrl || "/api", withCredentials: Boolean(remoteBaseUrl) });
// export const api = axios.create({ baseURL: remoteBaseUrl || "/api", withCredentials: Boolean(remoteBaseUrl) });
// // interceptor only added to `api`, never to `publicApi`

// // then in your login/register components:
// import { publicApi } from '@/api'
// await publicApi.post('/auth/local', {...})
