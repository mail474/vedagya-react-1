import { Ico } from './AdminIcons'

interface EyebrowProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Eyebrow({ children, style }: EyebrowProps) {
  return (
    <div className="admin-eyebrow" style={style}>
      {children}
    </div>
  )
}

type BadgeKind = 'ok' | 'warn' | 'bad' | 'neutral'

interface BadgeProps {
  kind?: BadgeKind
  children: React.ReactNode
}

export function Badge({ kind = 'neutral', children }: BadgeProps) {
  return (
    <span className={`admin-badge admin-badge-${kind}`}>
      <span className="admin-badge-dot" />
      {children}
    </span>
  )
}

type BtnVariant = 'ghost' | 'accent' | 'warn' | 'danger'

interface BtnProps {
  children: React.ReactNode
  variant?: BtnVariant
  icon?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function Btn({ children, variant = 'ghost', icon, onClick, style }: BtnProps) {
  return (
    <button className={`admin-btn admin-btn-${variant}`} onClick={onClick} style={style}>
      {icon && <Ico name={icon} size={15} />}
      {children}
    </button>
  )
}

interface SegmentedProps {
  options: string[]
  value: string
  onChange: (v: string) => void
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div className="admin-seg">
      {options.map((o) => (
        <button
          key={o}
          className={`admin-seg-btn${o === value ? ' is-active' : ''}`}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

interface PageHeadProps {
  title: string
  sub: string
  actions?: React.ReactNode
}

export function PageHead({ title, sub, actions }: PageHeadProps) {
  return (
    <div className="admin-page-head">
      <div>
        <Eyebrow>{sub}</Eyebrow>
        <h1 className="admin-page-title">{title}</h1>
      </div>
      {actions && <div className="admin-page-actions">{actions}</div>}
    </div>
  )
}
