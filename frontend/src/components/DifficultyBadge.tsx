import type { Difficulty } from '../types'

const LABELS: Record<Difficulty, string> = {
  BEGINNER:     'Beginner',
  EASY:         'Easy',
  INTERMEDIATE: 'Intermediate',
  ADVANCED:     'Advanced',
  EXPERT:       'Expert',
}

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`badge-difficulty badge-${difficulty}`}>
      {LABELS[difficulty]}
    </span>
  )
}
