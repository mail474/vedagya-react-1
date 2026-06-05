import { useState } from 'react'
import { Ico } from '../AdminIcons'
import { Badge, Btn, Eyebrow, PageHead, Segmented } from '../AdminUI'

type TxStatus = 'Succeeded' | 'Failed' | 'Refunded' | 'Pending'
type BadgeKind = 'ok' | 'warn' | 'bad' | 'neutral'

interface Transaction {
  id: string
  user: string
  amount: string
  status: TxStatus
  kind: BadgeKind
  gateway: string
}

const TX: Transaction[] = [
  {
    id: '#20451',
    user: 'Daniel Cho',
    amount: '$249.00',
    status: 'Succeeded',
    kind: 'ok',
    gateway: 'Stripe',
  },
  {
    id: '#20450',
    user: 'Lena Hofer',
    amount: '$29.00',
    status: 'Succeeded',
    kind: 'ok',
    gateway: 'Stripe',
  },
  {
    id: '#20449',
    user: 'Marcus Reyes',
    amount: '$12.00',
    status: 'Failed',
    kind: 'bad',
    gateway: 'PayPal',
  },
  {
    id: '#20448',
    user: 'Sofia Marino',
    amount: '$74.00',
    status: 'Refunded',
    kind: 'neutral',
    gateway: 'Stripe',
  },
  {
    id: '#20447',
    user: 'Priya Nair',
    amount: '$29.00',
    status: 'Pending',
    kind: 'warn',
    gateway: 'Stripe',
  },
  {
    id: '#20446',
    user: 'Daniel Cho',
    amount: '$249.00',
    status: 'Succeeded',
    kind: 'ok',
    gateway: 'Stripe',
  },
  {
    id: '#20445',
    user: 'Tomas Vetter',
    amount: '$12.00',
    status: 'Succeeded',
    kind: 'ok',
    gateway: 'PayPal',
  },
]

const KEY_STATS = [
  ['Processed (30d)', '$248.6K'],
  ['Failed (30d)', '$3.1K'],
  ['Refunded (30d)', '$1.8K'],
  ['Next payout', '$61.2K'],
]

export function Payments() {
  const [filter, setFilter] = useState('All')

  const rows = TX.filter((t) => filter === 'All' || t.status === filter)

  return (
    <div className="admin-screen">
      <PageHead
        sub="BILLING / PAYMENTS"
        title="Payments"
        actions={
          <Btn icon="download" variant="ghost">
            Export
          </Btn>
        }
      />

      <Eyebrow style={{ marginBottom: 12 }}>KEY STATS</Eyebrow>
      <div className="admin-stat-grid">
        {KEY_STATS.map(([label, value]) => (
          <div key={label} className="admin-kpi">
            <div className="admin-kpi-label">{label}</div>
            <div className="admin-kpi-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="admin-toolbar" style={{ marginTop: 26 }}>
        <Segmented
          options={['All', 'Succeeded', 'Failed', 'Refunded', 'Pending']}
          value={filter}
          onChange={setFilter}
        />
        <span className="admin-result-count">
          {rows.length} / {TX.length}
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Txn</th>
              <th>User</th>
              <th className="admin-ta-r">Amount</th>
              <th>Status</th>
              <th>Gateway</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="admin-cell-dim">{t.id}</td>
                <td className="admin-cell-name">{t.user}</td>
                <td className="admin-ta-r admin-cell-name">{t.amount}</td>
                <td>
                  <Badge kind={t.kind}>{t.status}</Badge>
                </td>
                <td className="admin-cell-dim">{t.gateway}</td>
                <td className="admin-ta-r">
                  <span className="admin-icon-btn sm">
                    <Ico name="dots" size={15} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="admin-empty">NO MATCHING PAYMENTS</div>}
      </div>
    </div>
  )
}
