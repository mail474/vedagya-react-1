import { PageHead } from '../AdminUI'

const STATS = [
  { label: 'Total Users', value: '84,210' },
  { label: 'Total Payments', value: '$248.6K' },
]

export function Dashboard() {
  return (
    <div className="admin-screen">
      <PageHead sub="OVERVIEW" title="Dashboard" />
      <div className="admin-stat-grid two">
        {STATS.map((s) => (
          <div key={s.label} className="admin-kpi">
            <div className="admin-kpi-label">{s.label}</div>
            <div className="admin-kpi-value">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
