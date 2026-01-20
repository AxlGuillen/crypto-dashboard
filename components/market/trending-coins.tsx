"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Flame, TrendingUp, TrendingDown, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, cn } from "@/lib/utils"
import { useFavorites } from "@/hooks"
import type { TrendingCoin } from "@/types/crypto"

interface TrendingCoinsProps {
  trending: TrendingCoin[]
  loading: boolean
}

/**
 * Table displaying trending cryptocurrencies
 *
 * Features:
 * - Shows top 10 trending coins
 * - Displays rank, logo, name, price, 24h change, and market cap
 * - Fire icon indicating trending status
 * - Clickable rows for navigation to detail page
 * - Favorite toggle for each item
 *
 * @param props - Component props
 * @param props.trending - Array of trending coins from API
 * @param props.loading - If true, shows skeleton placeholder
 * @returns Trending coins table or skeleton if loading
 */
export function TrendingCoins({ trending, loading }: TrendingCoinsProps) {
  const router = useRouter()
  const { isFavorite, toggleFavorite } = useFavorites()

  if (loading) {
    return <TrendingCoinsSkeleton />
  }

  const handleRowClick = (id: string) => {
    router.push(`/crypto/${id}`)
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
            <Flame className="h-4 w-4 text-white" />
          </div>
          Trending Coins
          <Badge variant="secondary" className="ml-2 bg-orange-500/10 text-orange-500">
            Most Searched
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Coin</TableHead>
                <TableHead className="hidden text-right sm:table-cell">
                  Price
                </TableHead>
                <TableHead className="text-right">24h %</TableHead>
                <TableHead className="hidden text-right md:table-cell">
                  Market Cap
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trending.slice(0, 10).map((coin, index) => {
                const item = coin.item
                const priceChange = item.data?.price_change_percentage_24h?.usd ?? 0
                const isPositive = priceChange >= 0
                const isFav = isFavorite(item.id)

                return (
                  <TableRow
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    className="cursor-pointer transition-colors hover:bg-accent"
                  >
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span className="text-muted-foreground">{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.small}
                          alt={item.name}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            <Badge
                              variant="outline"
                              className="hidden px-1.5 py-0 text-xs uppercase sm:inline-flex"
                            >
                              {item.symbol}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground sm:hidden">
                            {item.symbol.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-right sm:table-cell">
                      {item.data?.price
                        ? formatCurrency(item.data.price)
                        : `${item.price_btc.toFixed(8)} BTC`}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-medium",
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
                        {isPositive ? "+" : ""}
                        {priceChange.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                      {item.data?.market_cap || `#${item.market_cap_rank}`}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            isFav
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton placeholder for TrendingCoins while loading
 *
 * @returns Skeleton table component
 */
function TrendingCoinsSkeleton() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="hidden h-4 w-20 sm:block" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="hidden h-4 w-16 md:block" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
