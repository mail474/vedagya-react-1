/** Display helpers for the admin console. Backend currency is INR. */

const inrCompact = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const inrFull = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const intFmt = new Intl.NumberFormat('en-IN')

/** Compact money for KPI cards, e.g. ₹2.5L. `rupees` is a plain number. */
export const moneyCompact = (rupees: number) => inrCompact.format(rupees || 0)

/** Full money for table rows, e.g. ₹1,249.00. */
export const money = (rupees: number) => inrFull.format(rupees || 0)

/** Thousands-separated integer, e.g. 84,210. */
export const number = (n: number) => intFmt.format(n || 0)

/** Short date, e.g. 12 Mar 2024. */
export function date(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Relative time, e.g. "2h ago" / "just now". */
export function timeAgo(iso: string | null): string {
  if (!iso) return 'never'
  const secs = (Date.now() - new Date(iso).getTime()) / 1000
  if (secs < 45) return 'just now'
  const mins = secs / 60
  if (mins < 60) return `${Math.round(mins)}m ago`
  const hrs = mins / 60
  if (hrs < 24) return `${Math.round(hrs)}h ago`
  const days = hrs / 24
  if (days < 30) return `${Math.round(days)}d ago`
  return date(iso)
}

/** Up-to-2-letter initials from a name/phone for avatars. */
export function initials(name: string | null, fallback = '?'): string {
  if (!name) return fallback
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return fallback
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Best display label for a user (name → phone → email → short id). */
export function userLabel(u: {
  full_name?: string | null
  phone?: string | null
  email?: string | null
  id?: string
}): string {
  return u.full_name || u.phone || u.email || (u.id ? u.id.slice(0, 8) : 'Unknown')
}

/** Title-case a snake_case enum value, e.g. "in_progress" → "In Progress". */
export function titleCase(s: string): string {
  return s
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
