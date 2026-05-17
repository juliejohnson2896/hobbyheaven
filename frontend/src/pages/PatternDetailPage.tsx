import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, Edit2, Trash2, Upload,
  CheckCircle2, Circle, ChevronRight, BookOpen,
} from 'lucide-react'
import { usePattern, useDeletePattern } from '../api/patterns'
import { apiClient } from '../api/client'
import { useQueryClient } from '@tanstack/react-query'
import { patternKeys } from '../api/patterns'
import DifficultyBadge from '../components/DifficultyBadge'
import { LoadingSpinner, ErrorState } from '../components/StateComponents'
import type { InstructionStep } from '../types'

export default function PatternDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: pattern, isLoading, isError } = usePattern(id ?? '')
  const { mutate: deletePattern } = useDeletePattern()
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleStep = (step: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      next.has(step) ? next.delete(step) : next.add(step)
      return next
    })
  }

  const handleDelete = () => {
    if (!id) return
    deletePattern(id, {
      onSuccess: () => navigate('/library'),
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return
    const form = new FormData()
    form.append('file', file)
    await apiClient.post(`/patterns/${id}/cover-image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    queryClient.invalidateQueries({ queryKey: patternKeys.detail(id) })
  }

  if (isLoading) return <div style={{ padding: 40 }}><LoadingSpinner /></div>
  if (isError || !pattern) return <div style={{ padding: 40 }}><ErrorState message="Pattern not found." /></div>

  const steps = pattern.instructions as InstructionStep[]
  const progress = steps.length > 0 ? Math.round((completedSteps.size / steps.length) * 100) : 0

  return (
    <div style={{ padding: '40px', maxWidth: 900, margin: '0 auto' }}>

      {/* ── Back ───────────────────────────────────── */}
      <Link to="/library" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: 28, textDecoration: 'none' }}>
        <ArrowLeft size={14} /> Back to Library
      </Link>

      {/* ── Hero ───────────────────────────────────── */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 28 }}>

        {/* Cover image */}
        <div style={{ position: 'relative', height: 280, background: 'var(--color-parchment)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {pattern.coverImagePath ? (
            <img src={`/api/v1/files?path=${encodeURIComponent(pattern.coverImagePath)}`} alt={pattern.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', opacity: 0.12 }}>✿</span>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', cursor: 'pointer', color: 'var(--color-ink-soft)' }}>
            <Upload size={13} /> {pattern.coverImagePath ? 'Change photo' : 'Add photo'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>

        {/* Pattern header */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', background: 'var(--color-parchment)', padding: '3px 10px', borderRadius: 999, color: 'var(--color-ink-soft)' }}>
                  {pattern.hobbyType.name}
                </span>
                <DifficultyBadge difficulty={pattern.difficulty} />
                {pattern.categories.map(c => (
                  <span key={c.id} style={{ fontSize: '0.72rem', color: 'var(--color-muted)', border: '1px solid var(--color-border)', borderRadius: 999, padding: '2px 8px' }}>
                    {c.name}
                  </span>
                ))}
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem' }}>{pattern.title}</h1>
              {pattern.author && <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>by {pattern.author}</p>}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {pattern.sourceUrl && (
                <a href={pattern.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: '0.8rem' }}>
                  <ExternalLink size={13} /> Source
                </a>
              )}
              <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Edit2 size={13} /> Edit
              </button>
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '8px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  <Trash2 size={13} />
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Sure?</span>
                  <button onClick={handleDelete} style={{ background: 'var(--color-terracotta)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 14px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Delete
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {pattern.description && (
            <p style={{ margin: '16px 0 0', color: 'var(--color-ink-soft)', lineHeight: 1.7, fontSize: '0.925rem' }}>
              {pattern.description}
            </p>
          )}

          {/* Tags */}
          {pattern.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
              {pattern.tags.map(tag => (
                <span key={tag.id} style={{ padding: '3px 10px', background: 'var(--color-parchment)', borderRadius: 999, fontSize: '0.72rem', color: 'var(--color-ink-soft)' }}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

        {/* ── Instructions ───────────────────────── */}
        <div>
          {steps.length > 0 && (
            <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BookOpen size={16} style={{ color: 'var(--color-terracotta)' }} />
                  <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Instructions</h2>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                  {completedSteps.size} / {steps.length} steps
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, background: 'var(--color-parchment)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-sage)', borderRadius: 2, transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {steps.map((step) => {
                  const done = completedSteps.has(step.step)
                  return (
                    <div
                      key={step.step}
                      onClick={() => toggleStep(step.step)}
                      style={{
                        display: 'flex', gap: 14, padding: '14px 12px',
                        borderRadius: 'var(--radius-md)', cursor: 'pointer',
                        background: done ? 'rgba(122, 158, 126, 0.08)' : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <div style={{ flexShrink: 0, paddingTop: 2 }}>
                        {done
                          ? <CheckCircle2 size={18} style={{ color: 'var(--color-sage)' }} />
                          : <Circle size={18} style={{ color: 'var(--color-border-strong)' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Step {step.step}
                          </span>
                          {step.title && (
                            <>
                              <ChevronRight size={12} style={{ color: 'var(--color-border-strong)' }} />
                              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: done ? 'var(--color-muted)' : 'var(--color-ink)', textDecoration: done ? 'line-through' : 'none' }}>
                                {step.title}
                              </span>
                            </>
                          )}
                        </div>
                        {step.body && (
                          <p style={{ margin: 0, fontSize: '0.85rem', color: done ? 'var(--color-muted)' : 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                            {step.body}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Materials */}
          {pattern.materials.length > 0 && (
            <div className="card" style={{ padding: '20px 22px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem' }}>Materials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pattern.materials.map(mat => (
                  <div key={mat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>{mat.name}</span>
                    {(mat.quantity || mat.unit) && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', flexShrink: 0 }}>
                        {mat.quantity}{mat.unit ? ` ${mat.unit}` : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata (hobby-specific fields) */}
          {Object.keys(pattern.metadata).length > 0 && (
            <div className="card" style={{ padding: '20px 22px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem' }}>Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(pattern.metadata).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)', textAlign: 'right' }}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem' }}>Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Added</span>
                <span>{new Date(pattern.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Updated</span>
                <span>{new Date(pattern.updatedAt).toLocaleDateString()}</span>
              </div>
              {steps.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Steps</span>
                  <span>{steps.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
