import { PageHead } from '../AdminUI'
import { getDashboard } from '../api'
import { useAsync } from '../hooks'
import { moneyCompact, number } from '../format'

export function Dashboard() {
  const { data, loading, error, refetch } = useAsync(getDashboard, [])

  const stats = [
    { label: 'Total Users', value: data ? number(data.total_users) : '—' },
    { label: 'Total Payments', value: data ? moneyCompact(data.total_payments) : '—' },
    { label: 'Active Users', value: data ? number(data.active_users) : '—' },
    { label: 'New Users (30d)', value: data ? number(data.new_users_30d) : '—' },
  ]

  return (
    <div className="admin-screen">
      <PageHead sub="OVERVIEW" title="Dashboard" />

      {error ? (
        <div className="admin-empty">
          {error}
          <button className="admin-bell-all" onClick={refetch} style={{ marginLeft: 12 }}>
            RETRY →
          </button>
        </div>
      ) : (
        <div className="admin-stat-grid">
          {stats.map((s) => (
            <div key={s.label} className="admin-kpi">
              <div className="admin-kpi-label">{s.label}</div>
              <div className="admin-kpi-value">{loading ? '···' : s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
