import { Loader2, type LucideIcon } from 'lucide-react'

// ─── Loading Spinner ──────────────────────────────────────────────────────────

export function LoadingSpinner({ message = 'Loading…' }: { message?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 12 }}>
      <Loader2 size={24} style={{ color: 'var(--color-terracotta)', animation: 'spin 1s linear infinite' }} />
      <span style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>{message}</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      {Icon && (
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <Icon size={40} style={{ color: 'var(--color-border-strong)' }} strokeWidth={1.5} />
        </div>
      )}
      <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-ink-soft)' }}>
        {title}
      </h3>
      {description && (
        <p style={{ margin: '0 0 24px', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

// ─── Error State ──────────────────────────────────────────────────────────────

export function ErrorState({ message = 'Something went wrong.' }: { message?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ color: 'var(--color-terracotta)', fontSize: '0.875rem' }}>{message}</p>
    </div>
  )
}
