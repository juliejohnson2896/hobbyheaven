import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PatternDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div style={{ padding: '40px' }}>
      <Link to="/library" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: 32 }}>
        <ArrowLeft size={14} />
        Back to Library
      </Link>
      <div className="section-label" style={{ marginBottom: 8 }}>Pattern Detail</div>
      <h1 style={{ margin: 0 }}>Pattern #{id}</h1>
      <p style={{ color: 'var(--color-muted)', marginTop: 12 }}>
        Full pattern detail view — coming once the backend API is wired up.
      </p>
    </div>
  )
}
