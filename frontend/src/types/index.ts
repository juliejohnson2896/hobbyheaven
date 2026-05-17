// ─── Enums ────────────────────────────────────────────────────────────────────

export type Difficulty = 'BEGINNER' | 'EASY' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export type ProgressStatus = 'WANT_TO_MAKE' | 'IN_PROGRESS' | 'COMPLETED'

export type UserRole = 'ADMIN' | 'USER'

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface HobbyType {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  hobbyTypeId: string
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Material {
  id: string
  patternId: string
  name: string
  quantity: number | null
  unit: string | null
  notes: string | null
  sortOrder: number
}

export interface InstructionStep {
  step: number
  title: string
  body: string
  imagePath: string | null
}

// ─── Pattern ──────────────────────────────────────────────────────────────────

export interface Pattern {
  id: string
  title: string
  description: string | null
  difficulty: Difficulty
  author: string | null
  sourceUrl: string | null
  coverImagePath: string | null
  hobbyTypeId: string
  hobbyType: HobbyType
  metadata: Record<string, unknown>   // JSONB — hobby-specific fields
  instructions: InstructionStep[]
  materials: Material[]
  categories: Category[]
  tags: Tag[]
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export interface PatternSummary {
  id: string
  title: string
  description: string | null
  difficulty: Difficulty
  author: string | null
  coverImagePath: string | null
  hobbyType: HobbyType
  categories: Category[]
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: string
}

// ─── User Relations ───────────────────────────────────────────────────────────

export interface UserProgress {
  id: string
  userId: string
  patternId: string
  status: ProgressStatus
  currentStep: number
  notes: string | null
  startedAt: string | null
  completedAt: string | null
}

export interface UserFavourite {
  userId: string
  patternId: string
  createdAt: string
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface CreatePatternRequest {
  title: string
  description?: string
  difficulty: Difficulty
  author?: string
  sourceUrl?: string
  hobbyTypeId: string
  categoryIds?: Set<string>
  tagNames?: Set<string>
  materials?: { name: string; quantity?: number; unit?: string; notes?: string; sortOrder?: number }[]
  metadata?: Record<string, unknown>
  instructions?: Record<string, unknown>[]
}

export interface ApiError {
  status: number
  message: string
  timestamp: string
}
