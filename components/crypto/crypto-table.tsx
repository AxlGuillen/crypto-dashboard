"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FavoriteButton } from "@/components/crypto/favorite-button"
import { useFavorites } from "@/hooks"
import { cn, formatCurrency, formatPercentage } from "@/lib/utils"
import type { Cryptocurrency } from "@/types/crypto"

interface CryptoTableProps {
  cryptos: Cryptocurrency[]
  loading?: boolean
  onSort?: (key: keyof Cryptocurrency) => void
}

/**
 * Displays a table of cryptocurrencies with sortable columns
 *
 * Features:
 * - Sortable columns (price, 24h change, market cap, volume)
 * - Favorite toggle for each row
 * - Clickable rows for navigation to detail page
 * - Responsive design with hidden columns on smaller screens
 *
 * @param props - Component props
 * @param props.cryptos - Array of cryptocurrency data to display
 * @param props.loading - If true, shows skeleton placeholder
 * @param props.onSort - Optional callback for column sorting
 * @returns Crypto table component or skeleton if loading
 */
export function CryptoTable({ cryptos, loading, onSort }: CryptoTableProps) {
  const { isFavorite, toggleFavorite } = useFavorites()

  if (loading) {
    return <CryptoTableSkeleton />
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => onSort?.("current_price")}
              >
                Price
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="hidden text-right sm:table-cell">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => onSort?.("price_change_percentage_24h")}
              >
                24h %
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="hidden text-right md:table-cell">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => onSort?.("market_cap")}
              >
                Market Cap
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="hidden text-right lg:table-cell">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => onSort?.("total_volume")}
              >
                Volume 24h
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cryptos.map((crypto) => (
            <CryptoRow
              key={crypto.id}
              crypto={crypto}
              isFavorite={isFavorite(crypto.id)}
              onToggleFavorite={() => toggleFavorite(crypto.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface CryptoRowProps {
  crypto: Cryptocurrency
  isFavorite: boolean
  onToggleFavorite: () => void
}

/**
 * Single row component for the crypto table
 *
 * @param props - Component props
 * @param props.crypto - Cryptocurrency data for this row
 * @param props.isFavorite - Whether the crypto is in favorites
 * @param props.onToggleFavorite - Callback to toggle favorite status
 * @returns Table row component
 */
function CryptoRow({ crypto, isFavorite, onToggleFavorite }: CryptoRowProps) {
  const router = useRouter()
  const priceChange = crypto.price_change_percentage_24h
  const isPositive = priceChange >= 0

  const handleRowClick = () => {
    router.push(`/crypto/${crypto.id}`)
  }

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={handleRowClick}
    >
      <TableCell className="w-10">
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          size="sm"
        />
      </TableCell>
      <TableCell className="text-center font-medium text-muted-foreground">
        {crypto.market_cap_rank}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            src={crypto.image}
            alt={crypto.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-medium">{crypto.name}</span>
            <span className="text-xs uppercase text-muted-foreground">
              {crypto.symbol}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(crypto.current_price)}
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center justify-end gap-1">
          <Badge
            variant="secondary"
            className={cn(
              "font-medium",
              isPositive
                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
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
      </TableCell>
      <TableCell className="hidden text-right md:table-cell">
        {formatCurrency(crypto.market_cap, true)}
      </TableCell>
      <TableCell className="hidden text-right lg:table-cell">
        {formatCurrency(crypto.total_volume, true)}
      </TableCell>
    </TableRow>
  )
}

/**
 * Skeleton placeholder for CryptoTable while loading
 *
 * @returns Skeleton table component
 */
function CryptoTableSkeleton() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="hidden text-right sm:table-cell">24h %</TableHead>
            <TableHead className="hidden text-right md:table-cell">Cap. Mercado</TableHead>
            <TableHead className="hidden text-right lg:table-cell">Volumen 24h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="mx-auto h-4 w-6" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="ml-auto h-6 w-16" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="ml-auto h-4 w-24" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
