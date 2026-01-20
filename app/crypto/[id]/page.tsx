"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Globe,
  FileText,
  Github,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { PriceChart } from "@/components/crypto/price-chart"
import { FavoriteButton } from "@/components/crypto/favorite-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCryptoDetails, useFavorites } from "@/hooks"
import { formatCurrency, formatNumber, cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CryptoDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { details, loading, error } = useCryptoDetails(id)
  const { isFavorite, toggleFavorite } = useFavorites()

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-lg text-red-500">{error}</p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/" className="mb-6 inline-flex">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        {loading ? (
          <CryptoDetailSkeleton />
        ) : details ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={details.image.large}
                  alt={details.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">{details.name}</h1>
                    <Badge variant="secondary" className="uppercase">
                      {details.symbol}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Rank #{details.market_data.market_cap.usd ? "N/A" : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FavoriteButton
                  isFavorite={isFavorite(id)}
                  onToggle={() => toggleFavorite(id)}
                  size="lg"
                  showLabel
                />
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="text-4xl font-bold">
                {formatCurrency(details.market_data.current_price.usd)}
              </span>
              <div className="flex gap-2">
                <PriceChangeBadge
                  label="24h"
                  value={details.market_data.price_change_percentage_24h}
                />
                <PriceChangeBadge
                  label="7d"
                  value={details.market_data.price_change_percentage_7d}
                />
                <PriceChangeBadge
                  label="30d"
                  value={details.market_data.price_change_percentage_30d}
                />
              </div>
            </div>

            {/* Chart */}
            <PriceChart cryptoId={id} cryptoName={details.name} />

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Market Cap"
                value={formatCurrency(details.market_data.market_cap.usd, true)}
              />
              <StatCard
                title="Volume 24h"
                value={formatCurrency(details.market_data.total_volume.usd, true)}
              />
              <StatCard
                title="Circulating Supply"
                value={formatNumber(details.market_data.circulating_supply, true)}
              />
              <StatCard
                title="Total Supply"
                value={
                  details.market_data.total_supply
                    ? formatNumber(details.market_data.total_supply, true)
                    : "Unlimited"
                }
              />
              <StatCard
                title="High 24h"
                value={formatCurrency(details.market_data.high_24h.usd)}
              />
              <StatCard
                title="Low 24h"
                value={formatCurrency(details.market_data.low_24h.usd)}
              />
            </div>

            {/* Description */}
            {details.description.en && (
              <Card>
                <CardHeader>
                  <CardTitle>About {details.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="prose prose-sm dark:prose-invert max-w-none line-clamp-6"
                    dangerouslySetInnerHTML={{
                      __html: details.description.en.split(". ").slice(0, 3).join(". ") + ".",
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {details.links.homepage[0] && (
                    <a
                      href={details.links.homepage[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </a>
                  )}
                  {details.links.blockchain_site[0] && (
                    <a
                      href={details.links.blockchain_site[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Explorer
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </a>
                  )}
                  {details.links.repos_url.github[0] && (
                    <a
                      href={details.links.repos_url.github[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  )
}

function PriceChangeBadge({ label, value }: { label: string; value: number }) {
  const isPositive = value >= 0

  return (
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
      {label}: {isPositive ? "+" : ""}
      {value?.toFixed(2)}%
    </Badge>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

function CryptoDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Price */}
      <Skeleton className="h-12 w-48" />

      {/* Chart */}
      <Skeleton className="h-[350px] w-full rounded-lg" />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
