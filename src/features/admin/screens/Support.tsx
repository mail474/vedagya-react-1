import { useState } from 'react'
import { Ico } from '../AdminIcons'
import { Badge, Btn, Eyebrow, PageHead, Segmented } from '../AdminUI'

type TicketStatus = 'Open' | 'In Progress' | 'Resolved'
type BadgeKind = 'ok' | 'warn' | 'bad' | 'neutral'

interface Ticket {
  id: string
  subject: string
  requester: string
  priority: string
  kind: BadgeKind
  status: TicketStatus
}

const TICKETS: Ticket[] = [
  {
    id: '#5521',
    subject: 'Cannot reset password',
    requester: 'Amara Okafor',
    priority: 'Urgent',
    kind: 'bad',
    status: 'Open',
  },
  {
    id: '#5519',
    subject: 'Invoice missing VAT',
    requester: 'Lena Hofer',
    priority: 'High',
    kind: 'warn',
    status: 'In Progress',
  },
  {
    id: '#5515',
    subject: 'Charged twice this month',
    requester: 'Daniel Cho',
    priority: 'High',
    kind: 'warn',
    status: 'Open',
  },
  {
    id: '#5512',
    subject: 'Feature request: dark mode',
    requester: 'Priya Nair',
    priority: 'Low',
    kind: 'neutral',
    status: 'Open',
  },
  {
    id: '#5508',
    subject: 'Refund not received',
    requester: 'Sofia Marino',
    priority: 'High',
    kind: 'warn',
    status: 'Resolved',
  },
  {
    id: '#5501',
    subject: 'How to upgrade plan?',
    requester: 'Tomas Vetter',
    priority: 'Low',
    kind: 'neutral',
    status: 'Resolved',
  },
]

const KEY_STATS = [
  ['Open', '23'],
  ['In Progress', '11'],
  ['Urgent', '9'],
  ['Resolved (7d)', '64'],
]

export function Support() {
  const [tab, setTab] = useState('All')

  const rows = TICKETS.filter((t) => tab === 'All' || t.status === tab)

  return (
    <div className="admin-screen">
      <PageHead
        sub="SUPPORT / HELPDESK"
        title="Support"
        actions={
          <Btn icon="plus" variant="accent">
            New ticket
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
          options={['All', 'Open', 'In Progress', 'Resolved']}
          value={tab}
          onChange={setTab}
        />
        <span className="admin-result-count">
          {rows.length} / {TICKETS.length}
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Subject</th>
              <th>Requester</th>
              <th>Priority</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="admin-cell-dim">{t.id}</td>
                <td className="admin-cell-name">{t.subject}</td>
                <td className="admin-cell-dim">{t.requester}</td>
                <td>
                  <Badge kind={t.kind}>{t.priority}</Badge>
                </td>
                <td className="admin-cell-dim">{t.status}</td>
                <td className="admin-ta-r">
                  <span className="admin-icon-btn sm">
                    <Ico name="chevron" size={15} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="admin-empty">NO MATCHING TICKETS</div>}
      </div>
    </div>
  )
}
