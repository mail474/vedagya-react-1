import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

/**
 * Gate for /admin. Validates the stored token, requires `role === 'admin'`, and
 * redirects to /login otherwise. Shows a lightweight loader while validating.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const token = useAuth((s) => s.token)
  const user = useAuth((s) => s.user)
  const status = useAuth((s) => s.status)
  const bootstrap = useAuth((s) => s.bootstrap)
  const logout = useAuth((s) => s.logout)

  useEffect(() => {
    if (token && status === 'idle') bootstrap()
  }, [token, status, bootstrap])

  if (!token) return <Navigate to="/login" replace />

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="auth-screen">
        <div className="auth-spinner" />
      </div>
    )
  }

  if (status === 'unauthed') return <Navigate to="/login" replace />

  if (user && user.role !== 'admin') {
    return (
      <div className="auth-screen">
        <div className="auth-card auth-denied">
          <div className="auth-brand-mark">
            <span />
            <span />
            <span />
            <span />
          </div>
          <h1 className="auth-title">Access denied</h1>
          <p className="auth-sub">
            This account ({user.phone || user.email || 'unknown'}) is not an administrator.
          </p>
          <button className="auth-btn" onClick={() => logout()}>
            Sign in with another account
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
