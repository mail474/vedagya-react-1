interface IcoProps {
  name: string
  size?: number
}

export function Ico({ name, size = 18 }: IcoProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
  }

  switch (name) {
    case 'dashboard':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    case 'users':
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
          <path d="M16.5 6.2a3 3 0 0 1 0 5.6" />
          <path d="M17 14.5c2.4.5 3.9 2.5 3.9 5.2" />
        </svg>
      )
    case 'money':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <line x1="12" y1="7" x2="12" y2="17" />
          <path d="M14.5 9.5c-.6-1-1.6-1.4-2.6-1.4-1.3 0-2.4.8-2.4 2 0 2.6 5 1.4 5 4 0 1.3-1.2 2.1-2.6 2.1-1.1 0-2.1-.5-2.6-1.4" />
        </svg>
      )
    case 'support':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.8-1.2 1.6v.5" />
          <line x1="11.5" y1="16.5" x2="11.5" y2="16.6" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...props}>
          <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6" />
          <line x1="15.5" y1="15.5" x2="20" y2="20" />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...props}>
          <polyline points="9 6 15 12 9 18" />
        </svg>
      )
    case 'chevronL':
      return (
        <svg {...props}>
          <polyline points="15 6 9 12 15 18" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...props}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    case 'download':
      return (
        <svg {...props}>
          <path d="M12 4v10" />
          <polyline points="8 11 12 15 16 11" />
          <line x1="5" y1="20" x2="19" y2="20" />
        </svg>
      )
    case 'dots':
      return (
        <svg {...props}>
          <circle cx="12" cy="6" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="18" r="1" />
        </svg>
      )
    case 'x':
      return (
        <svg {...props}>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      )
    case 'filter':
      return (
        <svg {...props}>
          <polygon points="3 5 21 5 14 13 14 19 10 21 10 13" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" />
        </svg>
      )
  }
}
