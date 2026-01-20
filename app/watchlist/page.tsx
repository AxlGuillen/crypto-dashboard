"use client"

import { useMemo } from "react"
import Link from "next/link"
import {
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Plus,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { CryptoCard, CryptoCardSkeleton } from "@/components/crypto/crypto-card"
import { ComparisonChart } from "@/components/crypto/comparison-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCryptos, useFavorites } from "@/hooks"
import { formatCurrency, cn } from "@/lib/utils"

export default function WatchlistPage() {
  const { favorites, removeFavorite } = useFavorites()
  const { cryptos, loading } = useCryptos({ perPage: 100, refreshInterval: 0 })

  const favoriteCryptos = useMemo(() => {
    return cryptos.filter((crypto) => favorites.includes(crypto.id))
  }, [cryptos, favorites])

  const stats = useMemo(() => {
    if (favoriteCryptos.length === 0) {
      return { totalValue: 0, totalChange: 0, avgChange: 0 }
    }

    const totalValue = favoriteCryptos.reduce(
      (sum, crypto) => sum + crypto.market_cap,
      0
    )
    const avgChange =
      favoriteCryptos.reduce(
        (sum, crypto) => sum + crypto.price_change_percentage_24h,
        0
      ) / favoriteCryptos.length

    return { totalValue, avgChange }
  }, [favoriteCryptos])

  const isEmpty = favorites.length === 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
            <h1 className="text-3xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            Your personalized cryptocurrency watchlist
          </p>
        </div>

        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cryptos in Watchlist
                  </CardTitle>
                  <Star className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{favorites.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Market Cap Total
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : formatCurrency(stats.totalValue, true)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Change 24h
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-2xl font-bold",
                      stats.avgChange >= 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {stats.avgChange >= 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    {loading ? "..." : `${stats.avgChange.toFixed(2)}%`}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Chart */}
            {favoriteCryptos.length > 0 && (
              <div className="mb-8">
                <ComparisonChart cryptos={favoriteCryptos} />
              </div>
            )}

            {/* Crypto Cards Grid */}
            <div>
              <h2 className="text-xl font-bold mb-4">Your Cryptocurrencies</h2>
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: favorites.length || 4 }).map((_, i) => (
                    <CryptoCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favoriteCryptos.map((crypto) => (
                    <CryptoCard
                      key={crypto.id}
                      crypto={crypto}
                      onRemove={() => removeFavorite(crypto.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Star className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Add cryptocurrencies to your watchlist by clicking the star icon
          in the main table or on the detail page.
        </p>
        <Link href="/">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Explore Cryptocurrencies
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
