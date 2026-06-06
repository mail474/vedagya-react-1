import { useEffect, useRef, useState } from 'react'
import { errorMessage } from './api'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Minimal data-fetching hook (no react-query in this project). Re-runs whenever
 * `deps` change (or `refetch` is called) and ignores stale (out-of-order) responses.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)
  const reqId = useRef(0)

  useEffect(() => {
    const id = ++reqId.current
    // Reset to the loading state on every (re)fetch. Synchronous setState in an
    // effect is intentional here — it's how this fetch hook shows a spinner.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)
    fn()
      .then((d) => {
        if (id === reqId.current) setData(d)
      })
      .catch((e) => {
        if (id === reqId.current) setError(errorMessage(e))
      })
      .finally(() => {
        if (id === reqId.current) setLoading(false)
      })
    // `fn` is intentionally excluded — callers pass a fresh closure each render;
    // `deps` is the caller-declared trigger list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  const refetch = () => setNonce((n) => n + 1)

  return { data, loading, error, refetch }
}

/** Debounce a fast-changing value (e.g. a search box) by `delay` ms. */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
