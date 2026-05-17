import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import type { Pattern, PatternSummary, Page } from '../types'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const patternKeys = {
  all: ['patterns'] as const,
  lists: () => [...patternKeys.all, 'list'] as const,
  list: (filters: PatternFilters) => [...patternKeys.lists(), filters] as const,
  detail: (id: string) => [...patternKeys.all, id] as const,
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PatternFilters {
  page?: number
  size?: number
  hobbyTypeId?: string
  categoryId?: string
  difficulty?: string
  tag?: string
  search?: string
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function usePatterns(filters: PatternFilters = {}) {
  return useQuery({
    queryKey: patternKeys.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<Page<PatternSummary>>('/patterns', {
        params: filters,
      })
      return data
    },
  })
}

export function usePattern(id: string) {
  return useQuery({
    queryKey: patternKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Pattern>(`/patterns/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreatePattern() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Pattern>) => {
      const { data } = await apiClient.post<Pattern>('/patterns', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patternKeys.lists() })
    },
  })
}

export function useDeletePattern() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/patterns/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patternKeys.lists() })
    },
  })
}
