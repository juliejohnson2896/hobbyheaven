import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ padding: '80px 40px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-terracotta)', margin: '0 0 12px' }}>404</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>This page doesn't exist.</p>
      <Link to="/library" className="btn-primary" style={{ display: 'inline-flex' }}>
        Back to Library
      </Link>
    </div>
  )
}
