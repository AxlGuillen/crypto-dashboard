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

/**
 * Custom hook for fetching detailed information about a specific cryptocurrency
 *
 * Provides comprehensive data including:
 * - Current price and market data
 * - Price change percentages (24h, 7d, 30d)
 * - Supply information
 * - Description and links
 *
 * @param id - The cryptocurrency ID (e.g., "bitcoin", "ethereum"), or null to skip fetch
 * @returns Object with crypto details, loading state, error, and refetch function
 */
export function useCryptoDetails(id: string | null): UseCryptoDetailsReturn {
  const [details, setDetails] = useState<CryptoDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetches cryptocurrency details from API
   * @param forceRefresh - If true, bypasses cache
   */
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

  // Fetch when ID changes
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
