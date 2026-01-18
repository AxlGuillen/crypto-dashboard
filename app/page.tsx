"use client"

import { useState } from "react"
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { StatCard, StatCardSkeleton } from "@/components/crypto/stat-card"
import { CryptoTable } from "@/components/crypto/crypto-table"
import type { Cryptocurrency } from "@/types/crypto"

// Datos de ejemplo para demostración
const mockCryptos: Cryptocurrency[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67542.00,
    market_cap: 1328000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 1418000000000,
    total_volume: 28500000000,
    high_24h: 68200,
    low_24h: 66800,
    price_change_24h: 1250.5,
    price_change_percentage_24h: 1.89,
    market_cap_change_24h: 24500000000,
    market_cap_change_percentage_24h: 1.88,
    circulating_supply: 19600000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 73738,
    ath_change_percentage: -8.4,
    ath_date: "2024-03-14T07:10:36.635Z",
    atl: 67.81,
    atl_change_percentage: 99500,
    atl_date: "2013-07-06T00:00:00.000Z",
    last_updated: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3456.78,
    market_cap: 415600000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 415600000000,
    total_volume: 15200000000,
    high_24h: 3520,
    low_24h: 3400,
    price_change_24h: -45.32,
    price_change_percentage_24h: -1.29,
    market_cap_change_24h: -5400000000,
    market_cap_change_percentage_24h: -1.28,
    circulating_supply: 120200000,
    total_supply: 120200000,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -29.1,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 798200,
    atl_date: "2015-10-20T00:00:00.000Z",
    last_updated: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.00,
    market_cap: 95800000000,
    market_cap_rank: 3,
    fully_diluted_valuation: 95800000000,
    total_volume: 45200000000,
    high_24h: 1.001,
    low_24h: 0.999,
    price_change_24h: 0.001,
    price_change_percentage_24h: 0.05,
    market_cap_change_24h: 120000000,
    market_cap_change_percentage_24h: 0.13,
    circulating_supply: 95800000000,
    total_supply: 95800000000,
    max_supply: null,
    ath: 1.32,
    ath_change_percentage: -24.4,
    ath_date: "2018-07-24T00:00:00.000Z",
    atl: 0.572521,
    atl_change_percentage: 74.7,
    atl_date: "2015-03-02T00:00:00.000Z",
    last_updated: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 312.45,
    market_cap: 48200000000,
    market_cap_rank: 4,
    fully_diluted_valuation: 62400000000,
    total_volume: 890000000,
    high_24h: 318,
    low_24h: 308,
    price_change_24h: 5.67,
    price_change_percentage_24h: 1.85,
    market_cap_change_24h: 875000000,
    market_cap_change_percentage_24h: 1.85,
    circulating_supply: 154000000,
    total_supply: 200000000,
    max_supply: 200000000,
    ath: 686.31,
    ath_change_percentage: -54.5,
    ath_date: "2021-05-10T07:24:17.097Z",
    atl: 0.0398177,
    atl_change_percentage: 784800,
    atl_date: "2017-10-19T00:00:00.000Z",
    last_updated: "2024-01-15T10:30:00.000Z",
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 148.92,
    market_cap: 65800000000,
    market_cap_rank: 5,
    fully_diluted_valuation: 85200000000,
    total_volume: 2850000000,
    high_24h: 152,
    low_24h: 145,
    price_change_24h: 3.42,
    price_change_percentage_24h: 2.35,
    market_cap_change_24h: 1520000000,
    market_cap_change_percentage_24h: 2.36,
    circulating_supply: 442000000,
    total_supply: 572000000,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -42.7,
    ath_date: "2021-11-06T21:54:35.825Z",
    atl: 0.500801,
    atl_change_percentage: 29600,
    atl_date: "2020-05-11T19:35:23.449Z",
    last_updated: "2024-01-15T10:30:00.000Z",
  },
]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)

  // Función para demostrar el loading state
  const toggleLoading = () => {
    setShowSkeleton(true)
    setTimeout(() => setShowSkeleton(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Resumen del Mercado</h2>
            <button
              onClick={toggleLoading}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {showSkeleton ? "Cargando..." : "Simular carga"}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {showSkeleton ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title="Cap. Total del Mercado"
                  value="$2.45T"
                  change={1.24}
                  icon={DollarSign}
                />
                <StatCard
                  title="Volumen 24h"
                  value="$89.5B"
                  change={-2.35}
                  icon={BarChart3}
                />
                <StatCard
                  title="Dominancia BTC"
                  value="52.4%"
                  change={0.15}
                  icon={TrendingUp}
                />
                <StatCard
                  title="Criptos Activas"
                  value="12,847"
                  icon={Activity}
                />
              </>
            )}
          </div>
        </section>

        {/* Crypto Table Section */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Top Criptomonedas</h2>
          <CryptoTable
            cryptos={mockCryptos}
            loading={showSkeleton}
          />
        </section>
      </main>
    </div>
  )
}
