"use client"

import { useState, useEffect, useCallback } from "react"
import { getCryptoList } from "@/lib/api"
import type { Cryptocurrency } from "@/types/crypto"

interface UseCryptosOptions {
  page?: number
  perPage?: number
  refreshInterval?: number // en milisegundos
}

interface UseCryptosReturn {
  cryptos: Cryptocurrency[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  lastUpdated: Date | null
}

export function useCryptos(options: UseCryptosOptions = {}): UseCryptosReturn {
  const { page = 1, perPage = 50, refreshInterval = 60000 } = options

  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchCryptos = useCallback(async () => {
    try {
      setError(null)
      const data = await getCryptoList(page, perPage)
      setCryptos(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data")
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    fetchCryptos()

    // Auto-refresh
    if (refreshInterval > 0) {
      const interval = setInterval(fetchCryptos, refreshInterval)
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
