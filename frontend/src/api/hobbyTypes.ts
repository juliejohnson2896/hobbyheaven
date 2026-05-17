import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import type { HobbyType, Category, Tag } from '../types'

// ─── Hobby Types ──────────────────────────────────────────────────────────────

export const hobbyTypeKeys = {
  all: ['hobbyTypes'] as const,
  categories: (id: string) => ['hobbyTypes', id, 'categories'] as const,
}

export function useHobbyTypes() {
  return useQuery({
    queryKey: hobbyTypeKeys.all,
    queryFn: async () => {
      const { data } = await apiClient.get<HobbyType[]>('/hobby-types')
      return data
    },
  })
}

export function useHobbyTypeCategories(hobbyTypeId: string | undefined) {
  return useQuery({
    queryKey: hobbyTypeKeys.categories(hobbyTypeId ?? ''),
    queryFn: async () => {
      const { data } = await apiClient.get<Category[]>(`/hobby-types/${hobbyTypeId}/categories`)
      return data
    },
    enabled: !!hobbyTypeId,
  })
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const tagKeys = {
  all: ['tags'] as const,
}

export function useTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: async () => {
      const { data } = await apiClient.get<Tag[]>('/tags')
      return data
    },
  })
}

// ─── Favourites ───────────────────────────────────────────────────────────────

export const favouriteKeys = {
  all: ['favourites'] as const,
}

export function useFavourites() {
  return useQuery({
    queryKey: favouriteKeys.all,
    queryFn: async () => {
      const { data } = await apiClient.get<string[]>('/users/me/favourites')
      return data as string[]
    },
  })
}

export function useToggleFavourite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ patternId, isFavourite }: { patternId: string; isFavourite: boolean }) => {
      if (isFavourite) {
        await apiClient.delete(`/users/me/favourites/${patternId}`)
      } else {
        await apiClient.post(`/users/me/favourites/${patternId}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favouriteKeys.all })
    },
  })
}
