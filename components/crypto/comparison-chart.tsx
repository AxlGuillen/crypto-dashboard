"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Cryptocurrency } from "@/types/crypto"

interface ComparisonChartProps {
  cryptos: Cryptocurrency[]
}

// Colors for the different chart lines
const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
]

/**
 * Line chart comparing performance of multiple cryptocurrencies
 *
 * Features:
 * - Normalized performance comparison (base 100)
 * - 7-day historical data from sparklines
 * - Color-coded lines for each cryptocurrency
 * - Interactive tooltip with values for all cryptos
 *
 * @param props - Component props
 * @param props.cryptos - Array of cryptocurrencies to compare
 * @returns Comparison chart component or null if no data
 */
export function ComparisonChart({ cryptos }: ComparisonChartProps) {
  const { resolvedTheme } = useTheme()

  const tickColor = resolvedTheme === "dark" ? "#a1a1aa" : "#71717a"
  const legendColor = resolvedTheme === "dark" ? "#a1a1aa" : "#71717a"

  const chartData = useMemo(() => {
    if (cryptos.length === 0) return []

    const maxPoints = Math.max(
      ...cryptos.map((c) => c.sparkline_in_7d?.price?.length || 0)
    )

    if (maxPoints === 0) return []

    const data: Record<string, number | string>[] = []

    for (let i = 0; i < maxPoints; i++) {
      const point: Record<string, number | string> = {
        index: i,
        day: `Day ${Math.floor((i / maxPoints) * 7) + 1}`,
      }

      cryptos.forEach((crypto) => {
        const prices = crypto.sparkline_in_7d?.price
        if (prices && prices.length > 0) {
          const priceIndex = Math.floor((i / maxPoints) * prices.length)
          const basePrice = prices[0]
          const currentPrice = prices[Math.min(priceIndex, prices.length - 1)]
          point[crypto.symbol.toUpperCase()] = ((currentPrice / basePrice) * 100)
        }
      })

      data.push(point)
    }

    const step = Math.max(1, Math.floor(data.length / 50))
    return data.filter((_, i) => i % step === 0)
  }, [cryptos])

  if (chartData.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Comparison (7 days)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Normalized performance (base 100)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 12 }}
              />
              <YAxis
                domain={["auto", "auto"]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 12 }}
                tickFormatter={(value) => `${value.toFixed(0)}`}
                width={50}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                        {payload.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-4 text-sm"
                          >
                            <span
                              className="flex items-center gap-2"
                              style={{ color: entry.color }}
                            >
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name}
                            </span>
                            <span className="font-medium text-foreground">
                              {Number(entry.value).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: legendColor, fontSize: 14 }}>{value}</span>
                )}
              />
              {cryptos.map((crypto, index) => (
                <Line
                  key={crypto.id}
                  type="monotone"
                  dataKey={crypto.symbol.toUpperCase()}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
