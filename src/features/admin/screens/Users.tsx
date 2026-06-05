import { useState } from 'react'
import { Ico } from '../AdminIcons'
import { Badge, Btn, Eyebrow, PageHead, Segmented } from '../AdminUI'

interface User {
  id: string
  name: string
  email: string
  plan: string
  status: 'Active' | 'Suspended' | 'Banned'
  seen: string
  joined: string
  spend: string
}

const USERS: User[] = [
  {
    id: 'U-1042',
    name: 'Amara Okafor',
    email: 'amara@northwind.io',
    plan: 'Enterprise',
    status: 'Active',
    seen: '2m ago',
    joined: '2024-03-11',
    spend: '$4,210',
  },
  {
    id: 'U-1039',
    name: 'Lena Hofer',
    email: 'lena.h@gmail.com',
    plan: 'Pro',
    status: 'Active',
    seen: '1h ago',
    joined: '2024-06-02',
    spend: '$612',
  },
  {
    id: 'U-1031',
    name: 'Marcus Reyes',
    email: 'm.reyes@orbit.co',
    plan: 'Basic',
    status: 'Suspended',
    seen: '3d ago',
    joined: '2023-11-20',
    spend: '$148',
  },
  {
    id: 'U-1028',
    name: 'Priya Nair',
    email: 'priya@studio.in',
    plan: 'Pro',
    status: 'Active',
    seen: '15m ago',
    joined: '2024-01-08',
    spend: '$980',
  },
  {
    id: 'U-1019',
    name: 'Tomas Vetter',
    email: 'tomas@vetter.de',
    plan: 'Free',
    status: 'Active',
    seen: '6h ago',
    joined: '2025-02-14',
    spend: '$0',
  },
  {
    id: 'U-1005',
    name: 'Sofia Marino',
    email: 'sofia.m@proton.me',
    plan: 'Basic',
    status: 'Banned',
    seen: '21d ago',
    joined: '2023-08-30',
    spend: '$74',
  },
  {
    id: 'U-0998',
    name: 'Daniel Cho',
    email: 'dcho@bytes.dev',
    plan: 'Enterprise',
    status: 'Active',
    seen: 'just now',
    joined: '2022-12-01',
    spend: '$8,940',
  },
  {
    id: 'U-0991',
    name: 'Hana Suzuki',
    email: 'hana@suzuki.jp',
    plan: 'Free',
    status: 'Active',
    seen: '2d ago',
    joined: '2025-04-19',
    spend: '$0',
  },
]

const STATUS_KIND: Record<User['status'], 'ok' | 'warn' | 'bad'> = {
  Active: 'ok',
  Suspended: 'warn',
  Banned: 'bad',
}

const ACTIVITY_LOG = [
  ['Signed in', 'web · Chrome'],
  ['Updated billing card', '···· 4242'],
  ['Opened ticket #5521', 'priority: high'],
  ['Upgraded plan', 'Basic → Pro'],
]

function UserDetail({ user, onClose }: { user: User; onClose: () => void }) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
  const meta: [string, string][] = [
    ['Plan', user.plan],
    ['Lifetime spend', user.spend],
    ['Joined', user.joined],
    ['Last seen', user.seen],
    ['User ID', user.id],
    ['Region', 'EU-West'],
  ]

  return (
    <div className="admin-drawer-scrim" onClick={onClose}>
      <aside className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="admin-drawer-head">
          <div>
            <Eyebrow>{user.id}</Eyebrow>
            <h2 className="admin-drawer-title">{user.name}</h2>
          </div>
          <button className="admin-icon-btn" onClick={onClose}>
            <Ico name="x" />
          </button>
        </div>
        <div className="admin-drawer-body">
          <div className="admin-avatar-block">
            <div className="admin-avatar-lg">{initials}</div>
            <div>
              <div className="admin-drawer-email">{user.email}</div>
              <div style={{ marginTop: 6 }}>
                <Badge kind={STATUS_KIND[user.status]}>{user.status}</Badge>
              </div>
            </div>
          </div>

          <Eyebrow style={{ marginTop: 6 }}>METADATA</Eyebrow>
          <div className="admin-meta-grid">
            {meta.map(([k, v]) => (
              <div key={k} className="admin-meta-cell">
                <span className="admin-meta-k">{k}</span>
                <span className="admin-meta-v">{v}</span>
              </div>
            ))}
          </div>

          <Eyebrow style={{ marginTop: 18 }}>ACTIVITY LOG</Eyebrow>
          <ul className="admin-event-list">
            {ACTIVITY_LOG.map(([text, meta], i) => (
              <li key={i} className="admin-event-row">
                <span className="admin-event-dot admin-dot-neutral" />
                <span className="admin-event-text">{text}</span>
                <span className="admin-event-meta">{meta}</span>
              </li>
            ))}
          </ul>

          <Eyebrow style={{ marginTop: 18 }}>QUICK ACTIONS</Eyebrow>
          <div className="admin-action-grid">
            <Btn variant="ghost">Reset password</Btn>
            <Btn variant="ghost">Impersonate</Btn>
            <Btn variant="warn">Suspend account</Btn>
            <Btn variant="danger">Ban user</Btn>
          </div>
        </div>
      </aside>
    </div>
  )
}

export function Users() {
  const [q, setQ] = useState('')
  const [plan, setPlan] = useState('All')
  const [selected, setSelected] = useState<User | null>(null)

  const filtered = USERS.filter(
    (u) =>
      (plan === 'All' || u.plan === plan) &&
      (u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        u.id.toLowerCase().includes(q.toLowerCase())),
  )

  return (
    <div className="admin-screen">
      <PageHead
        sub="USERS / DIRECTORY"
        title="User Management"
        actions={
          <>
            <Btn icon="download" variant="ghost">
              Export
            </Btn>
            <Btn icon="plus" variant="accent">
              Add user
            </Btn>
          </>
        }
      />

      <div className="admin-toolbar">
        <div className="admin-search">
          <Ico name="search" size={15} />
          <input
            className="admin-search-input"
            placeholder="Search name, email or ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Segmented
          options={['All', 'Free', 'Basic', 'Pro', 'Enterprise']}
          value={plan}
          onChange={setPlan}
        />
        <span className="admin-result-count">
          {filtered.length} / {USERS.length}
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Last seen</th>
              <th>Joined</th>
              <th className="admin-ta-r">Spend</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="admin-row-click" onClick={() => setSelected(u)}>
                <td>
                  <div className="admin-cell-user">
                    <span className="admin-avatar-sm">
                      {u.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                    <div>
                      <div className="admin-cell-name">{u.name}</div>
                      <div className="admin-cell-email">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="admin-plan-tag">{u.plan}</span>
                </td>
                <td>
                  <Badge kind={STATUS_KIND[u.status]}>{u.status}</Badge>
                </td>
                <td className="admin-cell-dim">{u.seen}</td>
                <td className="admin-cell-dim">{u.joined}</td>
                <td className="admin-ta-r admin-cell-name">{u.spend}</td>
                <td className="admin-ta-r">
                  <span className="admin-icon-btn sm">
                    <Ico name="chevron" size={15} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="admin-empty">NO MATCHING USERS</div>}
      </div>

      {selected && <UserDetail user={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
