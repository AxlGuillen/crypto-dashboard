"use client"

import { useState, useEffect, useCallback } from "react"
import { getCryptoList } from "@/lib/api"
import type { Cryptocurrency } from "@/types/crypto"

interface UseCryptosOptions {
  page?: number
  perPage?: number
  refreshInterval?: number // milliseconds
}

interface UseCryptosReturn {
  cryptos: Cryptocurrency[]
  loading: boolean
  error: string | null
  refetch: (forceRefresh?: boolean) => Promise<void>
  lastUpdated: Date | null
}

/**
 * Custom hook for fetching a list of cryptocurrencies
 *
 * Features:
 * - Fetches cryptocurrency list sorted by market cap
 * - Supports pagination
 * - Auto-refresh with configurable interval
 * - Tracks last update time
 *
 * @param options - Configuration options
 * @param options.page - Page number for pagination (default: 1)
 * @param options.perPage - Number of results per page (default: 50)
 * @param options.refreshInterval - Auto-refresh interval in ms (default: 60000, 0 to disable)
 * @returns Object with cryptos array, loading state, error, refetch function, and lastUpdated timestamp
 */
export function useCryptos(options: UseCryptosOptions = {}): UseCryptosReturn {
  const { page = 1, perPage = 50, refreshInterval = 60000 } = options

  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  /**
   * Fetches cryptocurrency list from API
   * @param forceRefresh - If true, bypasses cache
   */
  const fetchCryptos = useCallback(async (forceRefresh = false) => {
    try {
      setError(null)
      if (forceRefresh) {
        setLoading(true)
      }
      const data = await getCryptoList(page, perPage, "usd", forceRefresh)
      setCryptos(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data")
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    fetchCryptos(false)

    if (refreshInterval > 0) {
      const interval = setInterval(() => fetchCryptos(false), refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchCryptos, refreshInterval])

  return {
    cryptos,
    loading,
    error,
    refetch: fetchCryptos,
    lastUpdated,
  }
}
