"use client"

import {
  DollarSign,
  BarChart3,
  Coins,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatNumber, cn } from "@/lib/utils"

interface MarketHeroProps {
  globalData: {
    total_market_cap: { usd: number }
    total_volume: { usd: number }
    market_cap_percentage: { btc: number; eth: number }
    market_cap_change_percentage_24h_usd: number
    active_cryptocurrencies: number
  } | null
  loading: boolean
}

/**
 * Hero section displaying global cryptocurrency market statistics
 *
 * Features:
 * - Total market cap with 24h change
 * - 24h trading volume
 * - Active cryptocurrencies count
 * - BTC and ETH dominance with progress bars
 * - Market distribution pie chart
 *
 * @param props - Component props
 * @param props.globalData - Global market data from API
 * @param props.loading - If true, shows skeleton placeholder
 * @returns Market hero component or skeleton if loading
 */
export function MarketHero({ globalData, loading }: MarketHeroProps) {
  if (loading) {
    return <MarketHeroSkeleton />
  }

  if (!globalData) {
    return null
  }

  const btcDominance = globalData.market_cap_percentage.btc
  const ethDominance = globalData.market_cap_percentage.eth
  const altcoinsDominance = 100 - btcDominance - ethDominance

  const pieData = [
    { name: "Bitcoin", value: btcDominance, color: "#F7931A", gradient: "from-orange-400 to-orange-600" },
    { name: "Ethereum", value: ethDominance, color: "#627EEA", gradient: "from-indigo-400 to-indigo-600" },
    { name: "Altcoins", value: altcoinsDominance, color: "#8B5CF6", gradient: "from-violet-400 to-violet-600" },
  ]

  const marketChange = globalData.market_cap_change_percentage_24h_usd
  const isPositive = marketChange >= 0

  return (
    <div className="mb-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards - Left Side */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Market Cap Total */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Market Cap
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(globalData.total_market_cap.usd, true)}
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {marketChange.toFixed(2)}% in 24h
                </p>
              </CardContent>
            </Card>

            {/* Volume 24h */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Volume 24h
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(globalData.total_volume.usd, true)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Global trading volume
                </p>
              </CardContent>
            </Card>

            {/* Active Cryptos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Cryptos
                </CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(globalData.active_cryptocurrencies)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cryptocurrencies in the market
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Dominance Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/25">
                    <span className="text-lg font-bold text-white">₿</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">BTC Dominance</p>
                    <p className="text-2xl font-bold">{btcDominance.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                    style={{ width: `${btcDominance}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-500/25">
                    <span className="text-lg font-bold text-white">Ξ</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">ETH Dominance</p>
                    <p className="text-2xl font-bold">{ethDominance.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500"
                    style={{ width: `${ethDominance}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modern Pie Chart - Right Side */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Market Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center p-4">
            {/* Donut Chart with Center Label */}
            <div className="relative mx-auto aspect-square w-full max-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                    </filter>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    style={{ filter: "url(#shadow)" }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-lg font-bold">100%</span>
              </div>
            </div>

            {/* Modern Legend */}
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => ( 
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * Skeleton placeholder for MarketHero while loading
 *
 * @returns Skeleton hero component
 */
function MarketHeroSkeleton() {
  return (
    <div className="mb-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="p-4">
            <Skeleton className="mx-auto aspect-square w-full max-w-[200px] rounded-full" />
            <div className="mt-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
