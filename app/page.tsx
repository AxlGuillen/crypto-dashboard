"use client"

import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { StatCard, StatCardSkeleton } from "@/components/crypto/stat-card"
import { CryptoTable } from "@/components/crypto/crypto-table"
import { useCryptos, useGlobalData } from "@/hooks"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Home() {
  const {
    cryptos,
    loading: cryptosLoading,
    error: cryptosError,
    refetch: refetchCryptos,
    lastUpdated,
  } = useCryptos({ perPage: 50, refreshInterval: 0 })

  const {
    data: globalData,
    loading: globalLoading,
    error: globalError,
    refetch: refetchGlobal,
  } = useGlobalData({ refreshInterval: 0 })

  const loading = cryptosLoading || globalLoading
  const error = cryptosError || globalError

  const handleRefresh = async () => {
    await Promise.all([refetchCryptos(true), refetchGlobal(true)])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
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

        {/* Stats Section */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Market Overview</h2>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Updated: {lastUpdated.toLocaleTimeString("en-US")}
                </span>
              )}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {globalLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : globalData ? (
              <>
                <StatCard
                  title="Total Market Cap"
                  value={formatCurrency(globalData.total_market_cap.usd, true)}
                  change={globalData.market_cap_change_percentage_24h_usd}
                  icon={DollarSign}
                />
                <StatCard
                  title="Volume 24h"
                  value={formatCurrency(globalData.total_volume.usd, true)}
                  icon={BarChart3}
                />
                <StatCard
                  title="BTC Dominance"
                  value={`${globalData.market_cap_percentage.btc.toFixed(1)}%`}
                  icon={TrendingUp}
                />
                <StatCard
                  title="Active Cryptos"
                  value={formatNumber(globalData.active_cryptocurrencies)}
                  icon={Activity}
                />
              </>
            ) : (
              <>
                <StatCard
                  title="Total Market Cap"
                  value="--"
                  icon={DollarSign}
                />
                <StatCard title="Volumen 24h" value="--" icon={BarChart3} />
                <StatCard title="BTC Dominance" value="--" icon={TrendingUp} />
                <StatCard title="Active Cryptos" value="--" icon={Activity} />
              </>
            )}
          </div>
        </section>

        {/* Crypto Table Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Top 50 Cryptocurrencies</h2>
            <span className="text-sm text-muted-foreground">
              Click refresh to update data
            </span>
          </div>
          <CryptoTable cryptos={cryptos} loading={cryptosLoading} />
        </section>
      </main>
    </div>
  )
}
