import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { PatternSummary } from '../types'
import DifficultyBadge from './DifficultyBadge'

interface PatternCardProps {
  pattern: PatternSummary
  isFavourite?: boolean
  onToggleFavourite?: (patternId: string, current: boolean) => void
}

export default function PatternCard({ pattern, isFavourite = false, onToggleFavourite }: PatternCardProps) {
  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Cover image */}
      <Link to={`/library/${pattern.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          height: 168,
          background: 'var(--color-parchment)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {pattern.coverImagePath ? (
            <img
              src={`/api/v1/files?path=${encodeURIComponent(pattern.coverImagePath)}`}
              alt={pattern.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', opacity: 0.15, userSelect: 'none' }}>
              ✿
            </span>
          )}

          {/* Hobby type pill */}
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
            borderRadius: 999,
            padding: '3px 10px',
            fontSize: '0.7rem',
            fontWeight: 500,
            color: 'var(--color-ink-soft)',
          }}>
            {pattern.hobbyType.name}
          </div>
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <Link to={`/library/${pattern.id}`} style={{ textDecoration: 'none', flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', lineHeight: 1.3 }}>
              {pattern.title}
            </h3>
          </Link>
          <DifficultyBadge difficulty={pattern.difficulty} />
        </div>

        {pattern.description && (
          <p style={{
            margin: '0 0 10px',
            fontSize: '0.8rem',
            color: 'var(--color-muted)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}>
            {pattern.description}
          </p>
        )}

        {/* Tags */}
        {pattern.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            {pattern.tags.slice(0, 3).map(tag => (
              <span key={tag.id} style={{
                padding: '2px 8px',
                background: 'var(--color-parchment)',
                borderRadius: 999,
                fontSize: '0.68rem',
                color: 'var(--color-ink-soft)',
              }}>
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          {pattern.author ? (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>by {pattern.author}</span>
          ) : <span />}

          {onToggleFavourite && (
            <button
              onClick={e => { e.preventDefault(); onToggleFavourite(pattern.id, isFavourite) }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: isFavourite ? 'var(--color-terracotta)' : 'var(--color-border-strong)',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
              }}
              title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            >
              <Heart size={16} fill={isFavourite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
