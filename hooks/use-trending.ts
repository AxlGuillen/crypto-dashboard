"use client"

import { useState, useEffect, useCallback } from "react"
import { getTrendingCoins } from "@/lib/api"
import type { TrendingCoin } from "@/types/crypto"

interface UseTrendingReturn {
  trending: TrendingCoin[]
  loading: boolean
  error: string | null
  refetch: (forceRefresh?: boolean) => Promise<void>
}

export function useTrending(): UseTrendingReturn {
  const [trending, setTrending] = useState<TrendingCoin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrending = useCallback(async (forceRefresh = false) => {
    try {
      setError(null)
      if (forceRefresh) {
        setLoading(true)
      }
      const data = await getTrendingCoins(forceRefresh)
      setTrending(data.coins)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching trending")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrending(false)
  }, [fetchTrending])

  return {
    trending,
    loading,
    error,
    refetch: fetchTrending,
  }
}
