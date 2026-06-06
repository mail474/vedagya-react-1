import { useState } from 'react'
import { Ico } from '../AdminIcons'
import { Badge, Btn, Eyebrow, PageHead, Segmented } from '../AdminUI'
import {
  countTickets,
  getTicket,
  listTickets,
  replyTicket,
  updateTicket,
  errorMessage,
  type AdminTicket,
  type TicketPriority,
  type TicketStatus,
} from '../api'
import { useAsync } from '../hooks'
import { timeAgo, titleCase } from '../format'

type Filter = 'All' | 'Open' | 'In Progress' | 'Resolved' | 'Closed'

const FILTER_TO_STATUS: Record<Filter, TicketStatus | undefined> = {
  All: undefined,
  Open: 'open',
  'In Progress': 'in_progress',
  Resolved: 'resolved',
  Closed: 'closed',
}

const STATUS_KIND: Record<TicketStatus, 'ok' | 'warn' | 'bad' | 'neutral'> = {
  open: 'bad',
  in_progress: 'warn',
  resolved: 'ok',
  closed: 'neutral',
}

const PRIORITY_KIND: Record<TicketPriority, 'ok' | 'warn' | 'bad' | 'neutral'> = {
  low: 'neutral',
  medium: 'ok',
  high: 'warn',
  urgent: 'bad',
}

const STATUS_OPTIONS: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed']
const PRIORITY_OPTIONS: TicketPriority[] = ['low', 'medium', 'high', 'urgent']
const PAGE_SIZE = 30

// ─── Detail drawer ───

function TicketDetail({
  ticketId,
  onClose,
  onChanged,
}: {
  ticketId: string
  onClose: () => void
  onChanged: () => void
}) {
  const { data, loading, error, refetch } = useAsync(() => getTicket(ticketId), [ticketId])
  const [reply, setReply] = useState('')
  const [internal, setInternal] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function withBusy(fn: () => Promise<unknown>) {
    setBusy(true)
    setActionError(null)
    try {
      await fn()
      refetch()
      onChanged()
    } catch (e) {
      setActionError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  async function sendReply() {
    if (!reply.trim()) return
    await withBusy(() => replyTicket(ticketId, { message: reply.trim(), is_internal: internal }))
    setReply('')
  }

  return (
    <div className="admin-drawer-scrim" onClick={onClose}>
      <aside className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="admin-drawer-head">
          <div>
            <Eyebrow>{ticketId.slice(0, 8)}</Eyebrow>
            <h2 className="admin-drawer-title">
              {data ? data.title : loading ? 'Loading…' : 'Ticket'}
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
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <Badge kind={STATUS_KIND[data.status]}>{titleCase(data.status)}</Badge>
                <Badge kind={PRIORITY_KIND[data.priority]}>{titleCase(data.priority)}</Badge>
                <Badge kind="neutral">{titleCase(data.category)}</Badge>
              </div>

              <Eyebrow>DESCRIPTION</Eyebrow>
              <p className="admin-drawer-email" style={{ margin: '8px 0 18px', lineHeight: 1.5 }}>
                {data.description}
              </p>

              <Eyebrow>SET STATUS</Eyebrow>
              <div style={{ marginTop: 8 }}>
                <Segmented
                  options={STATUS_OPTIONS.map(titleCase)}
                  value={titleCase(data.status)}
                  onChange={(v) =>
                    withBusy(() =>
                      updateTicket(ticketId, {
                        status: STATUS_OPTIONS.find((s) => titleCase(s) === v),
                      }),
                    )
                  }
                />
              </div>

              <Eyebrow style={{ marginTop: 16 }}>SET PRIORITY</Eyebrow>
              <div style={{ marginTop: 8 }}>
                <Segmented
                  options={PRIORITY_OPTIONS.map(titleCase)}
                  value={titleCase(data.priority)}
                  onChange={(v) =>
                    withBusy(() =>
                      updateTicket(ticketId, {
                        priority: PRIORITY_OPTIONS.find((p) => titleCase(p) === v),
                      }),
                    )
                  }
                />
              </div>

              <Eyebrow style={{ marginTop: 18 }}>CONVERSATION</Eyebrow>
              <ul className="admin-event-list">
                {data.replies.length === 0 && (
                  <li className="admin-event-row">
                    <span className="admin-event-text admin-cell-dim">No replies yet</span>
                  </li>
                )}
                {data.replies.map((r) => (
                  <li key={r.id} className="admin-event-row">
                    <span
                      className={`admin-event-dot admin-dot-${r.is_internal ? 'warn' : 'neutral'}`}
                    />
                    <span className="admin-event-text">
                      {r.is_internal ? '[internal] ' : ''}
                      {r.message}
                    </span>
                    <span className="admin-event-meta">{timeAgo(r.created_at)}</span>
                  </li>
                ))}
              </ul>

              <Eyebrow style={{ marginTop: 18 }}>REPLY</Eyebrow>
              {actionError && (
                <div className="admin-empty" style={{ padding: '10px 0' }}>
                  {actionError}
                </div>
              )}
              <textarea
                className="admin-search-input"
                style={{ width: '100%', minHeight: 80, padding: 10, marginTop: 8 }}
                placeholder="Type a reply…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <label
                className="admin-cell-dim"
                style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}
              >
                <input
                  type="checkbox"
                  checked={internal}
                  onChange={(e) => setInternal(e.target.checked)}
                />
                Internal note (not visible to user)
              </label>
              <div className="admin-action-grid">
                <Btn variant="accent" onClick={() => !busy && sendReply()}>
                  {busy ? 'Sending…' : 'Send reply'}
                </Btn>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

// ─── List ───

export function Support() {
  const [tab, setTab] = useState<Filter>('All')
  const [selected, setSelected] = useState<string | null>(null)
  // Bumped after a mutation to force list + stats to refetch.
  const [version, setVersion] = useState(0)
  const bump = () => setVersion((v) => v + 1)

  const { data, loading, error, refetch } = useAsync(
    () => listTickets({ status: FILTER_TO_STATUS[tab], limit: PAGE_SIZE }),
    [tab, version],
  )

  const stats = useAsync(
    () =>
      Promise.all([
        countTickets('open'),
        countTickets('in_progress'),
        countTickets('resolved'),
        countTickets(undefined),
      ]),
    [version],
  )

  const rows: AdminTicket[] = data?.items ?? []
  const [open, inProgress, resolved, total] = stats.data ?? [0, 0, 0, 0]
  const KEY_STATS: [string, string][] = [
    ['Open', String(open)],
    ['In Progress', String(inProgress)],
    ['Resolved', String(resolved)],
    ['Total', String(total)],
  ]

  return (
    <div className="admin-screen">
      <PageHead sub="SUPPORT / HELPDESK" title="Support" />

      <Eyebrow style={{ marginBottom: 12 }}>KEY STATS</Eyebrow>
      <div className="admin-stat-grid">
        {KEY_STATS.map(([label, value]) => (
          <div key={label} className="admin-kpi">
            <div className="admin-kpi-label">{label}</div>
            <div className="admin-kpi-value">{stats.loading ? '···' : value}</div>
          </div>
        ))}
      </div>

      <div className="admin-toolbar" style={{ marginTop: 26 }}>
        <Segmented
          options={['All', 'Open', 'In Progress', 'Resolved', 'Closed']}
          value={tab}
          onChange={(v) => setTab(v as Filter)}
        />
        <span className="admin-result-count">
          {loading ? '…' : `${rows.length} / ${data?.total ?? 0}`}
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="admin-row-click" onClick={() => setSelected(t.id)}>
                <td className="admin-cell-dim admin-mono">{t.id.slice(0, 8)}</td>
                <td className="admin-cell-name">{t.title}</td>
                <td className="admin-cell-dim">{titleCase(t.category)}</td>
                <td>
                  <Badge kind={PRIORITY_KIND[t.priority]}>{titleCase(t.priority)}</Badge>
                </td>
                <td>
                  <Badge kind={STATUS_KIND[t.status]}>{titleCase(t.status)}</Badge>
                </td>
                <td className="admin-cell-dim">{timeAgo(t.updated_at)}</td>
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
        {!loading && !error && rows.length === 0 && (
          <div className="admin-empty">NO MATCHING TICKETS</div>
        )}
      </div>

      {selected && (
        <TicketDetail ticketId={selected} onClose={() => setSelected(null)} onChanged={bump} />
      )}
    </div>
  )
}
