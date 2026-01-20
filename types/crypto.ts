/**
 * Cryptocurrency data from CoinGecko markets endpoint
 *
 * Contains market data including price, volume, market cap, and historical changes
 */
export interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  sparkline_in_7d?: {
    price: number[]
  }
}

/**
 * Historical market chart data
 *
 * Contains arrays of [timestamp, value] pairs for prices, market caps, and volumes
 */
export interface CryptoMarketChart {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

/**
 * Detailed cryptocurrency information
 *
 * Contains comprehensive data including description, images, market data, and external links
 */
export interface CryptoDetails {
  id: string
  symbol: string
  name: string
  description: {
    en: string
  }
  image: {
    thumb: string
    small: string
    large: string
  }
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    total_volume: { usd: number }
    high_24h: { usd: number }
    low_24h: { usd: number }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    circulating_supply: number
    total_supply: number | null
    max_supply: number | null
  }
  links: {
    homepage: string[]
    blockchain_site: string[]
    repos_url: {
      github: string[]
    }
  }
}

/**
 * Global cryptocurrency market data
 *
 * Contains aggregate market statistics including total market cap, volume, and dominance percentages
 */
export interface GlobalMarketData {
  data: {
    active_cryptocurrencies: number
    markets: number
    total_market_cap: { usd: number }
    total_volume: { usd: number }
    market_cap_percentage: { btc: number; eth: number }
    market_cap_change_percentage_24h_usd: number
  }
}

/**
 * Filter and pagination options for cryptocurrency list
 */
export interface CryptoFilter {
  search: string
  sortBy: keyof Cryptocurrency
  sortOrder: "asc" | "desc"
  perPage: number
  page: number
}

/**
 * Formatted data point for chart visualization
 */
export interface ChartDataPoint {
  date: string
  timestamp: number
  price: number
  volume?: number
  marketCap?: number
}

/**
 * Trending coin data from CoinGecko trending endpoint
 */
export interface TrendingCoin {
  item: {
    id: string
    coin_id: number
    name: string
    symbol: string
    market_cap_rank: number
    thumb: string
    small: string
    large: string
    slug: string
    price_btc: number
    score: number
    data: {
      price: number
      price_change_percentage_24h: {
        usd: number
      }
      market_cap: string
      total_volume: string
      sparkline: string
    }
  }
}

/**
 * Response wrapper for trending coins endpoint
 */
export interface TrendingResponse {
  coins: TrendingCoin[]
}
