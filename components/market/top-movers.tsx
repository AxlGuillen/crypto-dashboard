"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { TrendingUp, TrendingDown, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkline } from "@/components/crypto/price-chart"
import { formatCurrency, formatPercentage, cn } from "@/lib/utils"
import { useFavorites } from "@/hooks"
import type { Cryptocurrency } from "@/types/crypto"

interface TopMoversProps {
  cryptos: Cryptocurrency[]
  loading: boolean
}

export function TopMovers({ cryptos, loading }: TopMoversProps) {
  if (loading) {
    return <TopMoversSkeleton />
  }

  // Sort by price change to get gainers and losers
  const sorted = [...cryptos].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  )

  const gainers = sorted.slice(0, 6)
  const losers = sorted.slice(-6).reverse()

  return (
    <div className="mb-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Gainers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Ganadores 24h
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gainers.map((crypto) => (
              <MoverCard key={crypto.id} crypto={crypto} />
            ))}
          </CardContent>
        </Card>

        {/* Top Losers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Top Perdedores 24h
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {losers.map((crypto) => (
              <MoverCard key={crypto.id} crypto={crypto} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MoverCardProps {
  crypto: Cryptocurrency
}

function MoverCard({ crypto }: MoverCardProps) {
  const router = useRouter()
  const { isFavorite, toggleFavorite } = useFavorites()
  const priceChange = crypto.price_change_percentage_24h
  const isPositive = priceChange >= 0
  const isFav = isFavorite(crypto.id)

  const handleClick = () => {
    router.push(`/crypto/${crypto.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(crypto.id)
  }

  return (
    <div
      onClick={handleClick}
      className="group flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:bg-accent hover:shadow-md"
    >
      {/* Logo */}
      <Image
        src={crypto.image}
        alt={crypto.name}
        width={36}
        height={36}
        className="rounded-full"
      />

      {/* Name and Symbol */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-semibold">{crypto.name}</h4>
          <span className="text-xs uppercase text-muted-foreground">
            {crypto.symbol}
          </span>
        </div>
        <p className="text-sm font-medium">
          {formatCurrency(crypto.current_price)}
        </p>
      </div>

      {/* Sparkline */}
      <div className="hidden sm:block">
        {crypto.sparkline_in_7d?.price && (
          <Sparkline
            data={crypto.sparkline_in_7d.price}
            width={60}
            height={28}
          />
        )}
      </div>

      {/* Price Change */}
      <Badge
        variant="secondary"
        className={cn(
          "min-w-[70px] justify-center font-medium",
          isPositive
            ? "bg-green-500/10 text-green-500"
            : "bg-red-500/10 text-red-500"
        )}
      >
        {isPositive ? (
          <TrendingUp className="mr-1 h-3 w-3" />
        ) : (
          <TrendingDown className="mr-1 h-3 w-3" />
        )}
        {formatPercentage(priceChange)}
      </Badge>

      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={handleFavoriteClick}
      >
        <Star
          className={cn(
            "h-4 w-4",
            isFav ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
          )}
        />
      </Button>
    </div>
  )
}

function TopMoversSkeleton() {
  return (
    <div className="mb-8">
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, colIndex) => (
          <Card key={colIndex}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="hidden h-7 w-16 sm:block" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
