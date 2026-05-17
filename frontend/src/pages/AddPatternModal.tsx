import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useCreatePattern } from '../api/patterns'
import { useHobbyTypes, useHobbyTypeCategories } from '../api/hobbyTypes'
import { useQueryClient } from '@tanstack/react-query'
import type { Difficulty } from '../types'

interface Props {
  onClose: () => void
}

const DIFFICULTIES: Difficulty[] = ['BEGINNER', 'EASY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

const INPUT: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-ink)',
  background: 'var(--color-warm-white)',
  outline: 'none',
  boxSizing: 'border-box',
}

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 500,
  color: 'var(--color-ink-soft)',
  marginBottom: 5,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  )
}

export default function AddPatternModal({ onClose }: Props) {
  const queryClient = useQueryClient()
  const { mutate: createPattern, isPending } = useCreatePattern()
  const { data: hobbyTypes } = useHobbyTypes()

  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty]   = useState<Difficulty>('BEGINNER')
  const [author, setAuthor]           = useState('')
  const [sourceUrl, setSourceUrl]     = useState('')
  const [hobbyTypeId, setHobbyTypeId] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [tagInput, setTagInput]       = useState('')
  const [tags, setTags]               = useState<string[]>([])
  const [materials, setMaterials]     = useState<{ name: string; quantity: string; unit: string }[]>([])
  const [error, setError]             = useState<string | null>(null)

  const { data: categories } = useHobbyTypeCategories(hobbyTypeId || undefined)

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
    }
    setTagInput('')
  }

  const addMaterial = () => {
    setMaterials(prev => [...prev, { name: '', quantity: '', unit: '' }])
  }

  const handleSubmit = () => {
    if (!title.trim()) { setError('Title is required.'); return }
    if (!hobbyTypeId)  { setError('Please select a hobby type.'); return }
    setError(null)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createPattern({
      title,
      description:   description || undefined,
      difficulty,
      author:        author      || undefined,
      sourceUrl:     sourceUrl   || undefined,
      hobbyTypeId,
      categoryIds:   selectedCategories,
      tagNames:      new Set(tags),
      materials:     materials
        .filter(m => m.name.trim())
        .map((m, i) => ({
          name:      m.name,
          quantity:  m.quantity ? parseFloat(m.quantity) : undefined,
          unit:      m.unit     || undefined,
          sortOrder: i,
        })),
    } as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['patterns'] })
        onClose()
      },
      onError: () => setError('Failed to create pattern. Please try again.'),
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(30, 26, 23, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--color-warm-white)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
      }}>

        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="section-label" style={{ marginBottom: 4 }}>New Pattern</div>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Add to Library</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{ background: '#FDE8DC', border: '1px solid #F0B090', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem', color: 'var(--color-terracotta-dark)' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Title *">
                <input style={INPUT} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Granny Square Blanket" />
              </Field>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Description">
                <textarea style={{ ...INPUT, minHeight: 80, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="A short description of this pattern…" />
              </Field>
            </div>

            <Field label="Hobby Type *">
              <select style={INPUT} value={hobbyTypeId} onChange={e => { setHobbyTypeId(e.target.value); setSelectedCategories(new Set()) }}>
                <option value="">Select…</option>
                {hobbyTypes?.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </Field>

            <Field label="Difficulty">
              <select style={INPUT} value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
              </select>
            </Field>

            <Field label="Author / Designer">
              <input style={INPUT} value={author} onChange={e => setAuthor(e.target.value)} placeholder="e.g. Jane Doe" />
            </Field>

            <Field label="Source URL">
              <input style={INPUT} value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://…" type="url" />
            </Field>
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <Field label="Categories">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categories.map(cat => {
                  const selected = selectedCategories.has(cat.id)
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategories(prev => {
                        const next = new Set(prev)
                        selected ? next.delete(cat.id) : next.add(cat.id)
                        return next
                      })}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 999,
                        border: `1px solid ${selected ? 'var(--color-terracotta)' : 'var(--color-border)'}`,
                        background: selected ? 'rgba(193,96,42,0.08)' : 'transparent',
                        color: selected ? 'var(--color-terracotta)' : 'var(--color-ink-soft)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </Field>
          )}

          {/* Tags */}
          <Field label="Tags">
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                style={{ ...INPUT, flex: 1 }}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Type a tag and press Enter"
              />
              <button type="button" className="btn-secondary" onClick={addTag} style={{ padding: '9px 14px', flexShrink: 0 }}>Add</button>
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tags.map(tag => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: 'var(--color-parchment)', borderRadius: 999, fontSize: '0.78rem', color: 'var(--color-ink-soft)' }}>
                    {tag}
                    <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-muted)', lineHeight: 1, display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Materials */}
          <Field label="Materials">
            {materials.map((mat, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input style={INPUT} placeholder="Name (e.g. Yarn)" value={mat.name} onChange={e => setMaterials(prev => prev.map((m, j) => j === i ? { ...m, name: e.target.value } : m))} />
                <input style={INPUT} placeholder="Qty" type="number" value={mat.quantity} onChange={e => setMaterials(prev => prev.map((m, j) => j === i ? { ...m, quantity: e.target.value } : m))} />
                <input style={INPUT} placeholder="Unit" value={mat.unit} onChange={e => setMaterials(prev => prev.map((m, j) => j === i ? { ...m, unit: e.target.value } : m))} />
                <button onClick={() => setMaterials(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="btn-secondary" onClick={addMaterial} style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
              <Plus size={13} /> Add Material
            </button>
          </Field>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={isPending} style={{ opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Saving…' : 'Save Pattern'}
          </button>
        </div>
      </div>
    </div>
  )
}
