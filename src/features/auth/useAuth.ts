import { create } from 'zustand'
import { getMe, logout as apiLogout, type Me } from './authApi'

const TOKEN_KEY = 'token'
const REFRESH_KEY = 'refresh_token'

// 'idle'   — token present but not yet validated (triggers bootstrap)
// 'loading'— validating the token against /auth/me
// 'authed' — validated, `user` populated
// 'unauthed' — no/invalid token
type Status = 'idle' | 'loading' | 'authed' | 'unauthed'

interface AuthState {
  token: string | null
  user: Me | null
  status: Status
  /** Persist tokens after a successful OTP verify. */
  setSession: (access: string, refresh: string, user?: Me) => void
  /** Validate the stored token and load the current user. */
  bootstrap: () => Promise<void>
  /** Clear the session (server + local) and mark unauthenticated. */
  logout: () => Promise<void>
  /** Wipe local state without a server round-trip (used on hard 401s). */
  clearLocal: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  status: 'idle',

  setSession: (access, refresh, user) => {
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
    set({ token: access, user: user ?? null, status: user ? 'authed' : 'idle' })
  },

  bootstrap: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      set({ token: null, user: null, status: 'unauthed' })
      return
    }
    set({ token, status: 'loading' })
    try {
      const me = await getMe()
      set({ user: me, status: 'authed' })
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_KEY)
      set({ token: null, user: null, status: 'unauthed' })
    }
  },

  logout: async () => {
    try {
      await apiLogout()
    } catch {
      // best-effort — clear locally regardless
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    set({ token: null, user: null, status: 'unauthed' })
  },

  clearLocal: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    set({ token: null, user: null, status: 'unauthed' })
  },
}))
