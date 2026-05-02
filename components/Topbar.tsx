'use client'

const PERIODS = ['1S', '1M', '3M', '1A', 'Max']

interface Props {
  title: string
  action?: React.ReactNode
  showPeriod?: boolean
  period?: string
  onPeriod?: (p: string) => void
}

export default function Topbar({ title, action, showPeriod, period = '1M', onPeriod }: Props) {
  return (
    <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, flexShrink: 0, borderBottom: '1px solid var(--bd)', background: 'var(--bg)' }}>
      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: 'var(--t)' }}>{title}</span>
      {showPeriod && (
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg3)', borderRadius: 8, padding: 3 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => onPeriod?.(p)} style={{
              padding: '3px 10px', borderRadius: 6, fontSize: 12, border: 'none', cursor: 'pointer',
              background: period === p ? 'var(--bg4)' : 'transparent',
              color: period === p ? 'var(--t)' : 'var(--t2)',
              fontWeight: period === p ? 500 : 400,
            }}>{p}</button>
          ))}
        </div>
      )}
      {action}
    </div>
  )
}
