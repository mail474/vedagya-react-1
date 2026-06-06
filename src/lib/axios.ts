import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url || ''
    // Auth endpoints (login/verify) surface their own 401s to the page — don't
    // hijack them. For any other 401 the session is dead: clear it and bounce to
    // login, unless we're already there (avoids a reload loop).
    const isAuthCall = url.includes('/auth/')
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
