import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import type { Difficulty, PatternSummary } from '../types'

// ── Placeholder data until the API is wired ───────────────────────────────────
const PLACEHOLDER_PATTERNS: PatternSummary[] = [
  {
    id: '1',
    title: 'Granny Square Blanket',
    description: 'A classic granny square blanket with modern colour blocking.',
    difficulty: 'BEGINNER',
    author: 'Jane Doe',
    coverImagePath: null,
    hobbyType: { id: '1', name: 'Crochet', slug: 'crochet', description: null, icon: 'yarn', createdAt: '' },
    categories: [{ id: '1', name: 'Home Decor', slug: 'home-decor', hobbyTypeId: '1', createdAt: '' }],
    tags: [{ id: '1', name: 'blanket', slug: 'blanket' }, { id: '2', name: 'granny-square', slug: 'granny-square' }],
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'Amigurumi Bunny',
    description: 'An adorable stuffed bunny, perfect for beginners venturing into amigurumi.',
    difficulty: 'EASY',
    author: 'Crafty Corner',
    coverImagePath: null,
    hobbyType: { id: '1', name: 'Crochet', slug: 'crochet', description: null, icon: 'yarn', createdAt: '' },
    categories: [{ id: '2', name: 'Amigurumi', slug: 'amigurumi', hobbyTypeId: '1', createdAt: '' }],
    tags: [{ id: '3', name: 'amigurumi', slug: 'amigurumi' }, { id: '4', name: 'toy', slug: 'toy' }],
    createdAt: '2025-02-14T00:00:00Z',
    updatedAt: '2025-02-14T00:00:00Z',
  },
  {
    id: '3',
    title: 'Cable Stitch Cardigan',
    description: 'A sophisticated cardigan featuring raised cable stitches down the front panels.',
    difficulty: 'ADVANCED',
    author: 'Studio Yarns',
    coverImagePath: null,
    hobbyType: { id: '1', name: 'Crochet', slug: 'crochet', description: null, icon: 'yarn', createdAt: '' },
    categories: [{ id: '3', name: 'Garments', slug: 'garments', hobbyTypeId: '1', createdAt: '' }],
    tags: [{ id: '5', name: 'cardigan', slug: 'cardigan' }, { id: '6', name: 'wearable', slug: 'wearable' }],
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
  },
]

const DIFFICULTIES: Difficulty[] = ['BEGINNER', 'EASY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('')

  const filtered = PLACEHOLDER_PATTERNS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesDiff = difficulty === '' || p.difficulty === difficulty
    return matchesSearch && matchesDiff
  })

  return (
    <div style={{ padding: '40px 40px' }}>

      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>Your Collection</div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Pattern Library</h1>
          <p style={{ margin: '8px 0 0', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            {PLACEHOLDER_PATTERNS.length} patterns
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={16} />
          Add Pattern
        </button>
      </div>

      {/* ── Filters ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
          <input
            type="text"
            placeholder="Search patterns…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-warm-white)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-ink)',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={15} style={{ color: 'var(--color-muted)' }} />
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as Difficulty | '')}
            style={{
              padding: '10px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-warm-white)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-ink)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map(d => (
              <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Pattern Grid ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-muted)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>No patterns found</p>
          <p style={{ fontSize: '0.875rem', marginTop: 8 }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(pattern => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      )}
    </div>
  )
}

function PatternCard({ pattern }: { pattern: PatternSummary }) {
  return (
    <Link to={`/library/${pattern.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ overflow: 'hidden' }}>

        {/* Cover image / placeholder */}
        <div style={{
          height: 160,
          background: 'var(--color-parchment)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-muted)',
          fontSize: '0.8rem',
        }}>
          {pattern.coverImagePath
            ? <img src={`/api/v1/files/${pattern.coverImagePath}`} alt={pattern.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', opacity: 0.5 }}>No image</span>
          }
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--color-ink)', lineHeight: 1.3 }}>
              {pattern.title}
            </h3>
            <span className={`badge-difficulty badge-${pattern.difficulty}`}>
              {pattern.difficulty.charAt(0) + pattern.difficulty.slice(1).toLowerCase()}
            </span>
          </div>

          {pattern.description && (
            <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {pattern.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {pattern.tags.slice(0, 3).map(tag => (
              <span key={tag.id} style={{
                padding: '2px 8px',
                background: 'var(--color-parchment)',
                borderRadius: 999,
                fontSize: '0.7rem',
                color: 'var(--color-ink-soft)',
              }}>
                {tag.name}
              </span>
            ))}
          </div>

          {pattern.author && (
            <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              by {pattern.author}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
