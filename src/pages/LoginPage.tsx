import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../features/auth/auth.css'
import { useAuth } from '../features/auth/useAuth'
import { errorMessage, getMe, sendOtp, verifyOtp } from '../features/auth/authApi'

export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuth((s) => s.setSession)
  const clearLocal = useAuth((s) => s.clearLocal)
  const status = useAuth((s) => s.status)

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Already signed in as admin → skip the form.
  useEffect(() => {
    if (status === 'authed') navigate('/admin', { replace: true })
  }, [status, navigate])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { dev_otp } = await sendOtp(phone.trim())
      setDevOtp(dev_otp ?? null)
      setStep('otp')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const tokens = await verifyOtp(phone.trim(), otp.trim())
      // Store the token first so getMe() is authenticated.
      setSession(tokens.access_token, tokens.refresh_token)
      const me = await getMe()
      if (me.role !== 'admin') {
        clearLocal()
        setError('This account is not an administrator.')
        return
      }
      setSession(tokens.access_token, tokens.refresh_token, me)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={step === 'phone' ? handleSend : handleVerify}>
        <div className="auth-brand-mark">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="auth-eyebrow">ADMIN / CONSOLE</div>
        <h1 className="auth-title">{step === 'phone' ? 'Sign in' : 'Enter code'}</h1>
        <p className="auth-sub">
          {step === 'phone'
            ? 'Enter your registered phone number to receive a one-time code.'
            : `We sent a 6-digit code to ${phone}.`}
        </p>

        {error && <div className="auth-error">{error}</div>}

        {step === 'phone' ? (
          <div className="auth-field">
            <label className="auth-label" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              className="auth-input"
              type="tel"
              inputMode="tel"
              autoFocus
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        ) : (
          <div className="auth-field">
            <label className="auth-label" htmlFor="otp">
              One-time code
            </label>
            <input
              id="otp"
              className="auth-input otp"
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        )}

        <button
          className="auth-btn"
          type="submit"
          disabled={loading || (step === 'phone' ? !phone.trim() : otp.trim().length < 6)}
        >
          {loading ? 'Please wait…' : step === 'phone' ? 'Send code' : 'Verify & sign in'}
        </button>

        {step === 'otp' && (
          <>
            {devOtp && (
              <div className="auth-hint">
                Dev OTP: <code>{devOtp}</code>
              </div>
            )}
            <button
              type="button"
              className="auth-link"
              onClick={() => {
                setStep('phone')
                setOtp('')
                setError(null)
              }}
            >
              ← Change phone number
            </button>
          </>
        )}
      </form>
    </div>
  )
}
