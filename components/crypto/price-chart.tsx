"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCryptoChart } from "@/hooks"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface PriceChartProps {
  cryptoId: string
  cryptoName: string
}

const timeRanges = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "1a", days: 365 },
]

export function PriceChart({ cryptoId, cryptoName }: PriceChartProps) {
  const [selectedRange, setSelectedRange] = useState(7)
  const { resolvedTheme } = useTheme()
  const { chartData, loading, error } = useCryptoChart(cryptoId, {
    days: selectedRange,
  })

  const tickColor = resolvedTheme === "dark" ? "#a1a1aa" : "#71717a"

  const priceChange =
    chartData.length > 1
      ? chartData[chartData.length - 1].price - chartData[0].price
      : 0
  const isPositive = priceChange >= 0

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Precio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Error al cargar el gráfico
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Precio de {cryptoName}</CardTitle>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <Button
              key={range.days}
              variant={selectedRange === range.days ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRange(range.days)}
              className="h-8 px-3"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? "#22c55e" : "#ef4444"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? "#22c55e" : "#ef4444"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickColor, fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickColor, fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value, true)}
                  dx={-10}
                  width={80}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                          <p className="text-sm text-muted-foreground">
                            {data.date}
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {formatCurrency(data.price)}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SparklineProps {
  data: number[]
  className?: string
  width?: number
  height?: number
}

export function Sparkline({ data, className, width, height }: SparklineProps) {
  if (!data || data.length === 0) return null

  const chartData = data.map((price, index) => ({ price, index }))
  const isPositive = data[data.length - 1] >= data[0]

  const style = width && height ? { width, height } : undefined

  return (
    <div className={cn("h-12 w-24", className)} style={style}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isPositive ? "#22c55e" : "#ef4444"}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isPositive ? "#22c55e" : "#ef4444"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth={1.5}
            fill="url(#sparklineGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
