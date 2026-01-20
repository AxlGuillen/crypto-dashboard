"use client"

import { RefreshCw, AlertCircle, Store } from "lucide-react"
import { Header } from "@/components/layout/header"
import { MarketHero } from "@/components/market/market-hero"
import { TopMovers } from "@/components/market/top-movers"
import { TrendingCoins } from "@/components/market/trending-coins"
import { Button } from "@/components/ui/button"
import {
  useCryptos,
  useGlobalData,
  useTrending,
} from "@/hooks"

export default function MercadoPage() {
  const {
    cryptos,
    loading: cryptosLoading,
    error: cryptosError,
    refetch: refetchCryptos,
  } = useCryptos({ perPage: 100, refreshInterval: 0 })

  const {
    data: globalData,
    loading: globalLoading,
    error: globalError,
    refetch: refetchGlobal,
  } = useGlobalData({ refreshInterval: 0 })

  const {
    trending,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useTrending()

  const loading = cryptosLoading || globalLoading || trendingLoading
  const error = cryptosError || globalError || trendingError

  const handleRefresh = async () => {
    await Promise.all([
      refetchCryptos(true),
      refetchGlobal(true),
      refetchTrending(true),
    ])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Crypto Market</h1>
              <p className="text-sm text-muted-foreground">
                Complete analytical view of the cryptocurrency market
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-500">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Market Hero Section */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Global Metrics</h2>
          <MarketHero globalData={globalData} loading={globalLoading} />
        </section>

        {/* Top Gainers & Losers */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Daily Movers</h2>
          <TopMovers cryptos={cryptos} loading={cryptosLoading} />
        </section>

        {/* Trending Coins */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Trending</h2>
          <TrendingCoins trending={trending} loading={trendingLoading} />
        </section>
      </main>
    </div>
  )
}
