"use client"

import { useState, useEffect, useCallback } from "react"
import { getCryptoMarketChart } from "@/lib/api"
import type { CryptoMarketChart, ChartDataPoint } from "@/types/crypto"

interface UseCryptoChartOptions {
  days?: number | string
  currency?: string
}

interface UseCryptoChartReturn {
  chartData: ChartDataPoint[]
  rawData: CryptoMarketChart | null
  loading: boolean
  error: string | null
  refetch: (forceRefresh?: boolean) => Promise<void>
}

/**
 * Formats raw market chart data into chart-friendly data points
 *
 * @param data - Raw market chart data from API
 * @returns Array of formatted chart data points
 */
function formatChartData(data: CryptoMarketChart): ChartDataPoint[] {
  return data.prices.map(([timestamp, price], index) => ({
    date: new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    timestamp,
    price,
    volume: data.total_volumes[index]?.[1],
    marketCap: data.market_caps[index]?.[1],
  }))
}

/**
 * Custom hook for fetching cryptocurrency price chart data
 *
 * Features:
 * - Fetches historical price, volume, and market cap data
 * - Configurable time range (1 day to 1 year+)
 * - Provides both raw API data and formatted chart data
 *
 * @param id - The cryptocurrency ID, or null to skip fetch
 * @param options - Configuration options
 * @param options.days - Number of days of history (default: 7)
 * @param options.currency - Target currency (default: "usd")
 * @returns Object with formatted chartData, rawData, loading state, error, and refetch function
 */
export function useCryptoChart(
  id: string | null,
  options: UseCryptoChartOptions = {}
): UseCryptoChartReturn {
  const { days = 7, currency = "usd" } = options

  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [rawData, setRawData] = useState<CryptoMarketChart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetches chart data from API
   * @param forceRefresh - If true, bypasses cache
   */
  const fetchChart = useCallback(async (forceRefresh = false) => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await getCryptoMarketChart(id, days, currency, forceRefresh)
      setRawData(data)
      setChartData(formatChartData(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching chart data")
    } finally {
      setLoading(false)
    }
  }, [id, days, currency])

  // Fetch when ID or options change
  useEffect(() => {
    if (id) {
      fetchChart(false)
    } else {
      setChartData([])
      setRawData(null)
    }
  }, [id, fetchChart])

  return {
    chartData,
    rawData,
    loading,
    error,
    refetch: fetchChart,
  }
}
