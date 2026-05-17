import { useState, useCallback } from 'react'
import { Plus, Search, SlidersHorizontal, Library } from 'lucide-react'
import { usePatterns } from '../api/patterns'
import { useHobbyTypes, useHobbyTypeCategories, useFavourites, useToggleFavourite } from '../api/hobbyTypes'
import PatternCard from '../components/PatternCard'
import { LoadingSpinner, EmptyState, ErrorState } from '../components/StateComponents'
import type { Difficulty } from '../types'
import AddPatternModal from './AddPatternModal'

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'BEGINNER',     label: 'Beginner'     },
  { value: 'EASY',         label: 'Easy'         },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED',     label: 'Advanced'     },
  { value: 'EXPERT',       label: 'Expert'       },
]

const INPUT_STYLE: React.CSSProperties = {
  padding: '9px 12px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-warm-white)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-ink)',
  outline: 'none',
  width: '100%',
}

export default function LibraryPage() {
  const [search, setSearch]           = useState('')
  const [hobbyTypeId, setHobbyTypeId] = useState<string>('')
  const [categoryId, setCategoryId]   = useState<string>('')
  const [difficulty, setDifficulty]   = useState<string>('')
  const [page, setPage]               = useState(0)
  const [showAdd, setShowAdd]         = useState(false)

  const { data: hobbyTypes } = useHobbyTypes()
  const { data: categories } = useHobbyTypeCategories(hobbyTypeId || undefined)

  const { data, isLoading, isError } = usePatterns({
    page,
    size: 24,
    search:       search  || undefined,
    hobbyTypeId:  hobbyTypeId || undefined,
    categoryId:   categoryId  || undefined,
    difficulty:   difficulty  || undefined,
  })

  const { data: favouriteIds = [] } = useFavourites()
  const { mutate: toggleFavourite } = useToggleFavourite()

  const handleToggleFavourite = useCallback((patternId: string, current: boolean) => {
    toggleFavourite({ patternId, isFavourite: current })
  }, [toggleFavourite])

  const handleHobbyTypeChange = (id: string) => {
    setHobbyTypeId(id)
    setCategoryId('')    // reset category when hobby type changes
    setPage(0)
  }

  const totalPatterns = data?.totalElements ?? 0
  const totalPages    = data?.totalPages ?? 0

  return (
    <div style={{ padding: '40px' }}>

      {/* ── Header ─────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>Your Collection</div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Pattern Library</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
            {isLoading ? 'Loading…' : `${totalPatterns} pattern${totalPatterns !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} />
          Add Pattern
        </button>
      </div>

      {/* ── Filters ────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search patterns…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            style={{ ...INPUT_STYLE, paddingLeft: 32 }}
          />
        </div>

        {/* Hobby type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SlidersHorizontal size={14} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
          <select value={hobbyTypeId} onChange={e => handleHobbyTypeChange(e.target.value)} style={{ ...INPUT_STYLE, width: 'auto', cursor: 'pointer' }}>
            <option value="">All Hobbies</option>
            {hobbyTypes?.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>

        {/* Category — only shown when a hobby type is selected */}
        {hobbyTypeId && categories && categories.length > 0 && (
          <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(0) }} style={{ ...INPUT_STYLE, width: 'auto', cursor: 'pointer' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}

        {/* Difficulty */}
        <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setPage(0) }} style={{ ...INPUT_STYLE, width: 'auto', cursor: 'pointer' }}>
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>

      {/* ── Content ────────────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner message="Loading patterns…" />
      ) : isError ? (
        <ErrorState message="Could not load patterns. Is the backend running?" />
      ) : data?.content.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No patterns yet"
          description="Add your first pattern to get started."
          action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={15} /> Add Pattern</button>}
        />
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(268px, 1fr))',
            gap: 20,
          }}>
            {data?.content.map(pattern => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                isFavourite={favouriteIds.includes(pattern.id)}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>

          {/* ── Pagination ───────────────────────────── */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
              <button className="btn-secondary" onClick={() => setPage(p => p - 1)} disabled={page === 0} style={{ padding: '8px 16px', opacity: page === 0 ? 0.4 : 1 }}>
                Previous
              </button>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button className="btn-secondary" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} style={{ padding: '8px 16px', opacity: page >= totalPages - 1 ? 0.4 : 1 }}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Add Pattern Modal ──────────────────────── */}
      {showAdd && <AddPatternModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
