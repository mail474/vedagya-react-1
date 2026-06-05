import { useState } from 'react'
import './admin.css'
import { Ico } from './AdminIcons'
import { Eyebrow } from './AdminUI'
import { Dashboard } from './screens/Dashboard'
import { Users } from './screens/Users'
import { Payments } from './screens/Payments'
import { Support } from './screens/Support'

type Route = 'Dashboard' | 'Users' | 'Payments' | 'Support'

interface NavItem {
  icon: string
  label: string
  key: Route
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  { group: 'OVERVIEW', items: [{ icon: 'dashboard', label: 'Dashboard', key: 'Dashboard' }] },
  {
    group: 'MANAGE',
    items: [
      { icon: 'users', label: 'Users', key: 'Users' },
      { icon: 'money', label: 'Payments', key: 'Payments' },
    ],
  },
  { group: 'SYSTEM', items: [{ icon: 'support', label: 'Support', key: 'Support' }] },
]

const NOTIFS = [
  { title: 'Failed payment surge detected', meta: '+18 in last hour', dot: 'warn' },
  { title: 'Enterprise signup — Northwind Ltd', meta: 'high-value account', dot: 'ok' },
  { title: 'Pending tickets crossed 45', meta: 'queue building', dot: 'neutral' },
]

const SCREENS: Record<Route, React.ComponentType> = {
  Dashboard,
  Users,
  Payments,
  Support,
}

export function AdminConsole() {
  const [route, setRoute] = useState<Route>('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [bell, setBell] = useState(false)

  const Screen = SCREENS[route]

  return (
    <div className="admin-root">
      <div className={`admin-app${collapsed ? ' is-collapsed' : ''}`}>
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <div className="admin-brand-mark">
              <span />
              <span />
              <span />
              <span />
            </div>
            {!collapsed && (
              <div className="admin-brand-name">
                ADMIN
                <span className="admin-brand-sub">/console</span>
              </div>
            )}
          </div>

          <nav className="admin-nav">
            {NAV.map((g) => (
              <div key={g.group} className="admin-nav-group">
                {!collapsed && <div className="admin-nav-grouplabel">{g.group}</div>}
                {g.items.map((item) => (
                  <button
                    key={item.key}
                    className={`admin-nav-item${route === item.key ? ' is-active' : ''}`}
                    onClick={() => setRoute(item.key)}
                    title={item.label}
                  >
                    <span className="admin-nav-icon">
                      <Ico name={item.icon} />
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <button className="admin-collapse-btn" onClick={() => setCollapsed((c) => !c)}>
            <Ico name={collapsed ? 'chevron' : 'chevronL'} size={16} />
            {!collapsed && <span>COLLAPSE</span>}
          </button>
        </aside>

        {/* Main */}
        <div className="admin-main">
          <header className="admin-topbar">
            <div className="admin-crumbs">
              CONSOLE
              <span className="admin-crumb-sep">/</span>
              <span className="admin-crumb-now">{route.toUpperCase()}</span>
            </div>

            <div className="admin-topbar-right">
              <div className="admin-search admin-top-search">
                <Ico name="search" size={15} />
                <input className="admin-search-input" placeholder="Search…" />
              </div>

              <div className="admin-bell-wrap">
                <button
                  className={`admin-icon-btn${bell ? ' is-active' : ''}`}
                  onClick={() => setBell((b) => !b)}
                >
                  <Ico name="bell" />
                  <span className="admin-bell-dot" />
                </button>

                {bell && (
                  <div className="admin-bell-pop">
                    <div className="admin-bell-head">
                      <Eyebrow>NOTIFICATIONS</Eyebrow>
                      <span className="admin-bell-count">3 NEW</span>
                    </div>
                    {NOTIFS.map((n, i) => (
                      <div key={i} className="admin-bell-item">
                        <span className={`admin-event-dot admin-dot-${n.dot}`} />
                        <div>
                          <div className="admin-bell-title">{n.title}</div>
                          <div className="admin-bell-meta">{n.meta}</div>
                        </div>
                      </div>
                    ))}
                    <button
                      className="admin-bell-all"
                      onClick={() => {
                        setRoute('Support')
                        setBell(false)
                      }}
                    >
                      VIEW ALL →
                    </button>
                  </div>
                )}
              </div>

              <div className="admin-chip">
                <span className="admin-avatar-sm admin-mono">AD</span>
                {!collapsed && <span className="admin-chip-name">Admin</span>}
              </div>
            </div>
          </header>

          <main className="admin-content">
            <Screen />
          </main>
        </div>
      </div>
    </div>
  )
}
