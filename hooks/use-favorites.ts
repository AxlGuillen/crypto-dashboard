"use client"

import { useState, useEffect, useCallback, useMemo } from "react"

const STORAGE_KEY = "crypto-favorites"

interface UseFavoritesReturn {
  favorites: string[]
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

/**
 * Custom hook for managing user's favorite cryptocurrencies
 *
 * Features:
 * - Persists favorites to localStorage
 * - Handles hydration safely (SSR compatible)
 * - Provides add, remove, toggle, and clear operations
 *
 * @returns Object with favorites array and manipulation functions
 */
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    let mounted = true

    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored && mounted) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setFavorites(parsed)
          }
        }
      } catch (error) {
        console.error("Error loading favorites:", error)
      } finally {
        if (mounted) {
          setIsHydrated(true)
        }
      }
    }

    // Use requestAnimationFrame to avoid synchronous setState in effect
    requestAnimationFrame(loadFavorites)

    return () => {
      mounted = false
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error("Error saving favorites:", error)
      }
    }
  }, [favorites, isHydrated])

  /**
   * Adds a cryptocurrency ID to favorites
   * @param id - The cryptocurrency ID to add
   */
  const addFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
  }, [])

  /**
   * Removes a cryptocurrency ID from favorites
   * @param id - The cryptocurrency ID to remove
   */
  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav !== id))
  }, [])

  /**
   * Toggles a cryptocurrency ID in favorites (add if not present, remove if present)
   * @param id - The cryptocurrency ID to toggle
   */
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id)
      }
      return [...prev, id]
    })
  }, [])

  /**
   * Checks if a cryptocurrency ID is in favorites
   * @param id - The cryptocurrency ID to check
   * @returns True if the ID is in favorites
   */
  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  )

  /**
   * Clears all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  }
}
