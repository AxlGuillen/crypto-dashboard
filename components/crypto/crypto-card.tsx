"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { TrendingUp, TrendingDown, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkline } from "@/components/crypto/price-chart"
import { formatCurrency, formatPercentage, cn } from "@/lib/utils"
import type { Cryptocurrency } from "@/types/crypto"

interface CryptoCardProps {
  crypto: Cryptocurrency
  onRemove?: () => void
  showRemove?: boolean
}

/**
 * Card component displaying cryptocurrency information
 *
 * Features:
 * - Shows crypto logo, name, symbol, and price
 * - Displays 24h price change with color indicator
 * - Shows 7-day sparkline chart
 * - Optional remove button for watchlist
 * - Clickable for navigation to detail page
 *
 * @param props - Component props
 * @param props.crypto - Cryptocurrency data to display
 * @param props.onRemove - Optional callback when remove button is clicked
 * @param props.showRemove - If true, shows remove button (default: true)
 * @returns Crypto card component
 */
export function CryptoCard({ crypto, onRemove, showRemove = true }: CryptoCardProps) {
  const router = useRouter()
  const priceChange = crypto.price_change_percentage_24h
  const isPositive = priceChange >= 0

  const handleClick = () => {
    router.push(`/crypto/${crypto.id}`)
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* Header with logo and remove button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Image
              src={crypto.image}
              alt={crypto.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold">{crypto.name}</h3>
              <span className="text-xs uppercase text-muted-foreground">
                {crypto.symbol}
              </span>
            </div>
          </div>
          {showRemove && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Price and sparkline */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-2xl font-bold">
              {formatCurrency(crypto.current_price)}
            </p>
            <Badge
              variant="secondary"
              className={cn(
                "mt-1 font-medium",
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
          </div>
          {crypto.sparkline_in_7d?.price && (
            <Sparkline data={crypto.sparkline_in_7d.price} />
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatCurrency(crypto.market_cap, true)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume 24h</p>
            <p className="font-medium">{formatCurrency(crypto.total_volume, true)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton placeholder for CryptoCard while loading
 *
 * @returns Skeleton card component
 */
export function CryptoCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between mb-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-12 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
