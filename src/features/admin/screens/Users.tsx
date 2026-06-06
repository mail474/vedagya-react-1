import { useState } from 'react'
import { Ico } from '../AdminIcons'
import { Badge, Btn, Eyebrow, PageHead, Segmented } from '../AdminUI'
import { getUser, listUsers, updateUser, errorMessage, type AdminUser, type UserRole } from '../api'
import { useAsync, useDebounced } from '../hooks'
import { date, initials, money, number, timeAgo, titleCase, userLabel } from '../format'

type Filter = 'All' | 'Active' | 'Inactive'

const FILTER_TO_ACTIVE: Record<Filter, boolean | undefined> = {
  All: undefined,
  Active: true,
  Inactive: false,
}

const PAGE_SIZE = 30

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
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function mutate(body: { is_active?: boolean; role?: UserRole }) {
    setBusy(true)
    setActionError(null)
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
                <div className="admin-empty" style={{ padding: '10px 0' }}>
                  {actionError}
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
            </>
          )}
        </div>
      </aside>
    </div>
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
