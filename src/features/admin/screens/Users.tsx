import { useState } from 'react'
import { Ico } from '../AdminIcons'
import { Badge, Btn, Eyebrow, PageHead, Segmented } from '../AdminUI'
import {
  getUser,
  grantCredits,
  grantReportEntitlement,
  grantUnlimited,
  listUserMuhuratHistory,
  listUsers,
  updateUser,
  errorMessage,
  type AdminUser,
  type MuhuratHistoryItem,
  type UserRole,
} from '../api'
import { useAsync, useDebounced } from '../hooks'
import { date, initials, money, number, timeAgo, titleCase, userLabel } from '../format'

type Filter = 'All' | 'Active' | 'Inactive'

const FILTER_TO_ACTIVE: Record<Filter, boolean | undefined> = {
  All: undefined,
  Active: true,
  Inactive: false,
}

const PAGE_SIZE = 30

// Paid report types that can be comped — must match the backend catalogue's "paid" tier.
// (Free reports — horoscope/dasha/dosha/remedy — need no entitlement, so the API rejects them.)
const PAID_REPORTS: { id: string; label: string }[] = [
  { id: 'yearly', label: 'Varshaphala — Year Ahead' },
  { id: 'compatibility', label: 'Kundali Milan — Compatibility' },
  { id: 'marriage', label: 'Vivaha — Marriage' },
  { id: 'career', label: 'Karma — Career' },
  { id: 'finance', label: 'Artha — Finance' },
  { id: 'travel', label: 'Yatra — Travel' },
  { id: 'children', label: 'Santana — Children' },
  { id: 'health', label: 'Svasthya — Health' },
]

function statusBadge(active: boolean) {
  return <Badge kind={active ? 'ok' : 'bad'}>{active ? 'Active' : 'Inactive'}</Badge>
}

// ─── Detail drawer (live fetch + mutations) ───

function UserDetail({
  userId,
  onClose,
  onChanged,
}: {
  userId: string
  onClose: () => void
  onChanged: () => void
}) {
  const { data, loading, error, refetch } = useAsync(() => getUser(userId), [userId])
  const muhuratHistory = useAsync(() => listUserMuhuratHistory(userId), [userId])
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)
  const [creditAmount, setCreditAmount] = useState('')
  const [unlimitedDays, setUnlimitedDays] = useState('')
  const [reportType, setReportType] = useState('')

  async function mutate(body: { is_active?: boolean; role?: UserRole }) {
    setBusy(true)
    setActionError(null)
    setActionMsg(null)
    try {
      await updateUser(userId, body)
      refetch()
      onChanged()
    } catch (e) {
      setActionError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  // Run a grant action: clear prior messages, show a success line, refresh the drawer.
  async function runGrant(fn: () => Promise<string>) {
    setBusy(true)
    setActionError(null)
    setActionMsg(null)
    try {
      const msg = await fn()
      setActionMsg(msg)
      refetch()
      onChanged()
    } catch (e) {
      setActionError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  function handleGrantCredits() {
    const n = parseInt(creditAmount, 10)
    if (!Number.isFinite(n) || n < 1 || n > 10000) {
      setActionMsg(null)
      setActionError('Enter a credit amount between 1 and 10,000, then click Add credits.')
      return
    }
    void runGrant(async () => {
      const r = await grantCredits(userId, n)
      setCreditAmount('')
      return `Added ${number(n)} credits — new balance ${number(r.chat_credits)}.`
    })
  }

  function handleGrantUnlimited() {
    const n = parseInt(unlimitedDays, 10)
    if (!Number.isFinite(n) || n < 1 || n > 3650) {
      setActionMsg(null)
      setActionError('Enter days between 1 and 3650, then click Grant unlimited.')
      return
    }
    void runGrant(async () => {
      const r = await grantUnlimited(userId, n)
      setUnlimitedDays('')
      return `Unlimited chat granted until ${date(r.unlimited_until)}.`
    })
  }

  function handleGrantReport() {
    if (!reportType) {
      setActionMsg(null)
      setActionError('Choose a report from the list, then click Grant report.')
      return
    }
    void runGrant(async () => {
      const r = await grantReportEntitlement(userId, reportType)
      setReportType('')
      return `Unlocked the ${r.report_unlocked} report.`
    })
  }

  return (
    <div className="admin-drawer-scrim" onClick={onClose}>
      <aside className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="admin-drawer-head">
          <div>
            <Eyebrow>{userId.slice(0, 8)}</Eyebrow>
            <h2 className="admin-drawer-title">
              {data ? userLabel(data) : loading ? 'Loading…' : 'User'}
            </h2>
          </div>
          <button className="admin-icon-btn" onClick={onClose}>
            <Ico name="x" />
          </button>
        </div>

        <div className="admin-drawer-body">
          {error && <div className="admin-empty">{error}</div>}

          {data && (
            <>
              <div className="admin-avatar-block">
                <div className="admin-avatar-lg">{initials(userLabel(data))}</div>
                <div>
                  <div className="admin-drawer-email">{data.phone || data.email || '—'}</div>
                  <div style={{ marginTop: 6 }}>{statusBadge(data.is_active)}</div>
                </div>
              </div>

              <Eyebrow style={{ marginTop: 6 }}>METADATA</Eyebrow>
              <div className="admin-meta-grid">
                {(
                  [
                    ['Role', titleCase(data.role)],
                    ['Phone', data.phone || '—'],
                    ['Email', data.email || '—'],
                    ['Chat credits', number(data.chat_credits ?? 0)],
                    [
                      'Plan',
                      data.is_unlimited && data.unlimited_until
                        ? `Unlimited until ${date(data.unlimited_until)}`
                        : 'Free',
                    ],
                    [
                      'Reports unlocked',
                      data.unlocked_reports && data.unlocked_reports.length > 0
                        ? data.unlocked_reports.join(', ')
                        : '—',
                    ],
                    ['Lifetime spend', money(data.total_paid)],
                    ['Paid orders', number(data.paid_orders)],
                    ['Tickets', number(data.ticket_count)],
                    ['Birth details', data.has_birth_details ? 'Yes' : 'No'],
                    ['Phone verified', data.is_phone_verified ? 'Yes' : 'No'],
                    ['Joined', date(data.created_at)],
                    ['Last login', timeAgo(data.last_login)],
                    ['User ID', data.id.slice(0, 8)],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} className="admin-meta-cell">
                    <span className="admin-meta-k">{k}</span>
                    <span className="admin-meta-v">{v}</span>
                  </div>
                ))}
              </div>

              <Eyebrow style={{ marginTop: 18 }}>QUICK ACTIONS</Eyebrow>
              {actionError && (
                <div className="admin-empty" style={{ padding: '10px 0', color: '#d14343' }}>
                  {actionError}
                </div>
              )}
              {actionMsg && (
                <div className="admin-empty" style={{ padding: '10px 0', color: '#1e8e3e' }}>
                  {actionMsg}
                </div>
              )}
              <div className="admin-action-grid">
                {data.is_active ? (
                  <Btn variant="warn" onClick={() => !busy && mutate({ is_active: false })}>
                    Deactivate
                  </Btn>
                ) : (
                  <Btn variant="accent" onClick={() => !busy && mutate({ is_active: true })}>
                    Activate
                  </Btn>
                )}
                {data.role === 'admin' ? (
                  <Btn variant="ghost" onClick={() => !busy && mutate({ role: 'user' })}>
                    Revoke admin
                  </Btn>
                ) : (
                  <Btn variant="ghost" onClick={() => !busy && mutate({ role: 'admin' })}>
                    Make admin
                  </Btn>
                )}
              </div>

              <Eyebrow style={{ marginTop: 18 }}>GRANT / COMP</Eyebrow>
              <div className="admin-action-grid" style={{ alignItems: 'center' }}>
                <span className="admin-meta-k" style={{ minWidth: 110 }}>
                  Chat credits
                </span>
                <input
                  className="admin-search-input"
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="e.g. 10"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  style={{ width: 110 }}
                />
                <Btn variant="accent" onClick={() => !busy && handleGrantCredits()}>
                  {busy ? 'Working…' : 'Add credits'}
                </Btn>
              </div>
              <div className="admin-action-grid" style={{ alignItems: 'center', marginTop: 8 }}>
                <span className="admin-meta-k" style={{ minWidth: 110 }}>
                  Unlimited (days)
                </span>
                <input
                  className="admin-search-input"
                  type="number"
                  min={1}
                  max={3650}
                  placeholder="e.g. 30"
                  value={unlimitedDays}
                  onChange={(e) => setUnlimitedDays(e.target.value)}
                  style={{ width: 110 }}
                />
                <Btn variant="accent" onClick={() => !busy && handleGrantUnlimited()}>
                  {busy ? 'Working…' : 'Grant unlimited'}
                </Btn>
              </div>
              <div className="admin-action-grid" style={{ alignItems: 'center', marginTop: 8 }}>
                <span className="admin-meta-k" style={{ minWidth: 110 }}>
                  Unlock report
                </span>
                <select
                  className="admin-search-input"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{ width: 220 }}
                >
                  <option value="">Select a report…</option>
                  {PAID_REPORTS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <Btn variant="accent" onClick={() => !busy && handleGrantReport()}>
                  {busy ? 'Working…' : 'Grant report'}
                </Btn>
              </div>

              <MuhuratHistorySection history={muhuratHistory} />
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

// ─── Muhurat history sub-section ───

function MuhuratHistorySection({
  history,
}: {
  history: { data: MuhuratHistoryItem[] | null; loading: boolean; error: string | null }
}) {
  const items = history.data ?? []

  return (
    <>
      <Eyebrow style={{ marginTop: 18 }}>MUHURAT HISTORY</Eyebrow>
      {history.loading && <div className="admin-empty">LOADING…</div>}
      {history.error && !history.loading && (
        <div className="admin-empty" style={{ color: '#d14343' }}>
          {history.error}
        </div>
      )}
      {!history.loading && !history.error && items.length === 0 && (
        <div className="admin-empty">No paid muhurats yet.</div>
      )}
      {items.map((item) => (
        <div
          key={item.hash}
          className="admin-meta-grid"
          style={{ marginTop: 8, borderTop: '1px solid var(--admin-border)', paddingTop: 8 }}
        >
          <div className="admin-meta-cell">
            <span className="admin-meta-k">Event</span>
            <span className="admin-meta-v">{item.event_label ?? item.event ?? '—'}</span>
          </div>
          <div className="admin-meta-cell">
            <span className="admin-meta-k">Persons</span>
            <span className="admin-meta-v">{item.persons ?? '—'}</span>
          </div>
          <div className="admin-meta-cell">
            <span className="admin-meta-k">Date range</span>
            <span className="admin-meta-v">
              {item.start_date ?? '?'} → {item.end_date ?? '?'}
            </span>
          </div>
          <div className="admin-meta-cell">
            <span className="admin-meta-k">Paid</span>
            <span className="admin-meta-v">{date(item.paid_at)}</span>
          </div>
          <div className="admin-meta-cell">
            <span className="admin-meta-k">Top dates</span>
            <span className="admin-meta-v">
              {item.top_dates.length > 0 ? item.top_dates.join(', ') : '—'}
            </span>
          </div>
          <div className="admin-meta-cell">
            <span className="admin-meta-k">Status</span>
            <span className="admin-meta-v" style={{ display: 'flex', gap: 6 }}>
              <Badge kind={item.is_upcoming ? 'ok' : 'warn'}>
                {item.is_upcoming ? 'Upcoming' : 'Past'}
              </Badge>
              {item.status === 'pending' && <Badge kind="warn">Pending</Badge>}
            </span>
          </div>
          <div className="admin-meta-cell" style={{ gridColumn: '1 / -1' }}>
            <span className="admin-meta-k">Hash</span>
            <span className="admin-meta-v admin-mono" style={{ fontSize: 11 }}>
              {item.hash}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

// ─── List ───

export function Users() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('All')
  const [selected, setSelected] = useState<string | null>(null)
  const search = useDebounced(q)

  const { data, loading, error, refetch } = useAsync(
    () =>
      listUsers({
        search: search || undefined,
        is_active: FILTER_TO_ACTIVE[filter],
        limit: PAGE_SIZE,
      }),
    [search, filter],
  )

  const users: AdminUser[] = data?.items ?? []

  return (
    <div className="admin-screen">
      <PageHead sub="USERS / DIRECTORY" title="User Management" />

      <div className="admin-toolbar">
        <div className="admin-search">
          <Ico name="search" size={15} />
          <input
            className="admin-search-input"
            placeholder="Search name, phone or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Segmented
          options={['All', 'Active', 'Inactive']}
          value={filter}
          onChange={(v) => setFilter(v as Filter)}
        />
        <span className="admin-result-count">
          {loading ? '…' : `${users.length} / ${data?.total ?? 0}`}
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last login</th>
              <th>Joined</th>
              <th className="admin-ta-r">Credits</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="admin-row-click" onClick={() => setSelected(u.id)}>
                <td>
                  <div className="admin-cell-user">
                    <span className="admin-avatar-sm">{initials(userLabel(u))}</span>
                    <div>
                      <div className="admin-cell-name">{userLabel(u)}</div>
                      <div className="admin-cell-email">{u.email || u.phone || '—'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="admin-plan-tag">{titleCase(u.role)}</span>
                </td>
                <td>{statusBadge(u.is_active)}</td>
                <td className="admin-cell-dim">{timeAgo(u.last_login)}</td>
                <td className="admin-cell-dim">{date(u.created_at)}</td>
                <td className="admin-ta-r admin-cell-name">{number(u.chat_credits ?? 0)}</td>
                <td className="admin-ta-r">
                  <span className="admin-icon-btn sm">
                    <Ico name="chevron" size={15} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="admin-empty">LOADING…</div>}
        {error && !loading && (
          <div className="admin-empty">
            {error}
            <button className="admin-bell-all" onClick={refetch} style={{ marginLeft: 12 }}>
              RETRY →
            </button>
          </div>
        )}
        {!loading && !error && users.length === 0 && (
          <div className="admin-empty">NO MATCHING USERS</div>
        )}
      </div>

      {selected && (
        <UserDetail userId={selected} onClose={() => setSelected(null)} onChanged={refetch} />
      )}
    </div>
  )
}
