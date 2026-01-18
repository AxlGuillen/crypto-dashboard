import type {
  Cryptocurrency,
  CryptoDetails,
  CryptoMarketChart,
  GlobalMarketData,
} from "@/types/crypto"

const BASE_URL = "https://api.coingecko.com/api/v3"

// Cache simple en memoria
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 30 * 1000 // 30 segundos

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T
  }
  return null
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

async function fetchWithCache<T>(
  url: string,
  cacheKey: string
): Promise<T> {
  const cached = getCachedData<T>(cacheKey)
  if (cached) {
    return cached
  }

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment.")
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  setCachedData(cacheKey, data)
  return data
}

export async function getCryptoList(
  page = 1,
  perPage = 50,
  currency = "usd"
): Promise<Cryptocurrency[]> {
  const cacheKey = `crypto-list-${page}-${perPage}-${currency}`
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`

  return fetchWithCache<Cryptocurrency[]>(url, cacheKey)
}

export async function getCryptoDetails(id: string): Promise<CryptoDetails> {
  const cacheKey = `crypto-details-${id}`
  const url = `${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`

  return fetchWithCache<CryptoDetails>(url, cacheKey)
}

export async function getCryptoMarketChart(
  id: string,
  days: number | string = 7,
  currency = "usd"
): Promise<CryptoMarketChart> {
  const cacheKey = `crypto-chart-${id}-${days}-${currency}`
  const url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`

  return fetchWithCache<CryptoMarketChart>(url, cacheKey)
}

export async function getGlobalData(): Promise<GlobalMarketData> {
  const cacheKey = "global-data"
  const url = `${BASE_URL}/global`

  return fetchWithCache<GlobalMarketData>(url, cacheKey)
}

// Limpiar cache manualmente si es necesario
export function clearCache(): void {
  cache.clear()
}
