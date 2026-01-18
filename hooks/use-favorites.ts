"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "crypto-favorites"

interface UseFavoritesReturn {
  favorites: string[]
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  clearFavorites: () => void
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Cargar favoritos desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
    setIsHydrated(true)
  }, [])

  // Guardar en localStorage cuando cambian los favoritos
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error("Error saving favorites:", error)
      }
    }
  }, [favorites, isHydrated])

  const addFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav !== id))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fav) => fav !== id)
      }
      return [...prev, id]
    })
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  )

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
