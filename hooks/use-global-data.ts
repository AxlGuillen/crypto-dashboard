"use client"

import { useState, useEffect, useCallback } from "react"
import { getGlobalData } from "@/lib/api"
import type { GlobalMarketData } from "@/types/crypto"

interface UseGlobalDataOptions {
  refreshInterval?: number
}

interface UseGlobalDataReturn {
  data: GlobalMarketData["data"] | null
  loading: boolean
  error: string | null
  refetch: (forceRefresh?: boolean) => Promise<void>
}

export function useGlobalData(
  options: UseGlobalDataOptions = {}
): UseGlobalDataReturn {
  const { refreshInterval = 60000 } = options

  const [data, setData] = useState<GlobalMarketData["data"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setError(null)
      if (forceRefresh) {
        setLoading(true)
      }
      const response = await getGlobalData(forceRefresh)
      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching global data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(false)

    if (refreshInterval > 0) {
      const interval = setInterval(() => fetchData(false), refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
