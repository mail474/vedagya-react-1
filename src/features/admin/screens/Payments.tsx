import { useState } from 'react'
import { Ico } from '../AdminIcons'
import { Badge, Eyebrow, PageHead, Segmented } from '../AdminUI'
import { getDashboard, listPayments, type AdminPayment, type PaymentStatus } from '../api'
import { useAsync, useDebounced } from '../hooks'
import { date, money, moneyCompact, number, titleCase, userLabel } from '../format'

type Filter = 'All' | 'Paid' | 'Created' | 'Failed'

const FILTER_TO_STATUS: Record<Filter, PaymentStatus | undefined> = {
  All: undefined,
  Paid: 'paid',
  Created: 'created',
  Failed: 'failed',
}

const STATUS_KIND: Record<PaymentStatus, 'ok' | 'warn' | 'bad'> = {
  paid: 'ok',
  created: 'warn',
  failed: 'bad',
}

const PAGE_SIZE = 30

export function Payments() {
  const [filter, setFilter] = useState<Filter>('All')
  const [q, setQ] = useState('')
  const search = useDebounced(q)

  const stats = useAsync(getDashboard, [])
  const { data, loading, error, refetch } = useAsync(
    () =>
      listPayments({
        status: FILTER_TO_STATUS[filter],
        search: search || undefined,
        limit: PAGE_SIZE,
      }),
    [filter, search],
  )

  const rows: AdminPayment[] = data?.items ?? []
  const s = stats.data

  const KEY_STATS: [string, string][] = [
    ['Total Revenue', s ? moneyCompact(s.total_payments) : '—'],
    ['Paid Orders', s ? number(s.paid_orders) : '—'],
    ['Total Users', s ? number(s.total_users) : '—'],
    ['New Users (30d)', s ? number(s.new_users_30d) : '—'],
  ]

  return (
    <div className="admin-screen">
      <PageHead sub="BILLING / PAYMENTS" title="Payments" />

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
        <div className="admin-search">
          <Ico name="search" size={15} />
          <input
            className="admin-search-input"
            placeholder="Search user, order id or receipt…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Segmented
          options={['All', 'Paid', 'Created', 'Failed']}
          value={filter}
          onChange={(v) => setFilter(v as Filter)}
        />
        <span className="admin-result-count">
          {loading ? '…' : `${rows.length} / ${data?.total ?? 0}`}
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>User</th>
              <th className="admin-ta-r">Amount</th>
              <th>Status</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="admin-cell-dim admin-mono">{t.razorpay_order_id}</td>
                <td className="admin-cell-name">
                  {userLabel({ full_name: t.user_name, phone: t.user_phone })}
                </td>
                <td className="admin-ta-r admin-cell-name">{money(t.amount)}</td>
                <td>
                  <Badge kind={STATUS_KIND[t.status]}>{titleCase(t.status)}</Badge>
                </td>
                <td className="admin-cell-dim">{t.category || '—'}</td>
                <td className="admin-cell-dim">{date(t.created_at)}</td>
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
          <div className="admin-empty">NO MATCHING PAYMENTS</div>
        )}
      </div>
    </div>
  )
}
