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
  refetch: () => Promise<void>
}

function formatChartData(data: CryptoMarketChart): ChartDataPoint[] {
  return data.prices.map(([timestamp, price], index) => ({
    date: new Date(timestamp).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    }),
    timestamp,
    price,
    volume: data.total_volumes[index]?.[1],
    marketCap: data.market_caps[index]?.[1],
  }))
}

export function useCryptoChart(
  id: string | null,
  options: UseCryptoChartOptions = {}
): UseCryptoChartReturn {
  const { days = 7, currency = "usd" } = options

  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [rawData, setRawData] = useState<CryptoMarketChart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChart = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await getCryptoMarketChart(id, days, currency)
      setRawData(data)
      setChartData(formatChartData(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching chart data")
    } finally {
      setLoading(false)
    }
  }, [id, days, currency])

  useEffect(() => {
    if (id) {
      fetchChart()
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
