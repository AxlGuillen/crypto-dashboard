"use client"

import { useState, useEffect, useCallback } from "react"
import { getCryptoDetails } from "@/lib/api"
import type { CryptoDetails } from "@/types/crypto"

interface UseCryptoDetailsReturn {
  details: CryptoDetails | null
  loading: boolean
  error: string | null
  refetch: (forceRefresh?: boolean) => Promise<void>
}

export function useCryptoDetails(id: string | null): UseCryptoDetailsReturn {
  const [details, setDetails] = useState<CryptoDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDetails = useCallback(async (forceRefresh = false) => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await getCryptoDetails(id, forceRefresh)
      setDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching details")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchDetails(false)
    } else {
      setDetails(null)
    }
  }, [id, fetchDetails])

  return {
    details,
    loading,
    error,
    refetch: fetchDetails,
  }
}
