/**
 * CoinGecko API Client
 *
 * This module provides functions to fetch cryptocurrency data from the CoinGecko API.
 * All functions support caching with forceRefresh option.
 */

import type {
  Cryptocurrency,
  CryptoDetails,
  CryptoMarketChart,
  GlobalMarketData,
  TrendingResponse,
} from "@/types/crypto"
import {
  getCachedData,
  setCachedData,
  getExpiredCacheData,
  clearAllCache,
  invalidateCache,
} from "./cache-manager"

const BASE_URL = "https://api.coingecko.com/api/v3"

/**
 * Generic fetch function with caching support
 *
 * @param url - The API endpoint URL
 * @param cacheKey - Unique cache key for this request
 * @param forceRefresh - If true, bypasses cache and fetches fresh data
 * @returns Promise with the fetched data
 * @throws Error if fetch fails and no cache fallback is available
 */
async function fetchWithCache<T>(
  url: string,
  cacheKey: string,
  forceRefresh: boolean = false
): Promise<T> {
  // Try to get from cache first (unless forceRefresh is true)
  if (!forceRefresh) {
    const cached = getCachedData<T>(cacheKey)
    if (cached) {
      return cached
    }
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment.")
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Save to cache
    setCachedData(cacheKey, data)

    return data
  } catch (error) {
    // If fetch fails, try to use expired cache as fallback
    const expiredCache = getExpiredCacheData<T>(cacheKey)
    if (expiredCache) {
      console.warn(`[API] Using expired cache for: ${cacheKey}`)
      return expiredCache
    }

    throw error
  }
}

/**
 * Fetches a list of cryptocurrencies sorted by market cap
 *
 * @param page - Page number for pagination (default: 1)
 * @param perPage - Number of results per page (default: 50)
 * @param currency - Target currency for prices (default: "usd")
 * @param forceRefresh - If true, bypasses cache (default: false)
 * @returns Promise with array of Cryptocurrency objects
 */
export async function getCryptoList(
  page = 1,
  perPage = 50,
  currency = "usd",
  forceRefresh = false
): Promise<Cryptocurrency[]> {
  const cacheKey = `crypto-list-${page}-${perPage}-${currency}`
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`

  return fetchWithCache<Cryptocurrency[]>(url, cacheKey, forceRefresh)
}

/**
 * Fetches detailed information for a specific cryptocurrency
 *
 * @param id - The cryptocurrency ID (e.g., "bitcoin", "ethereum")
 * @param forceRefresh - If true, bypasses cache (default: false)
 * @returns Promise with CryptoDetails object
 */
export async function getCryptoDetails(
  id: string,
  forceRefresh = false
): Promise<CryptoDetails> {
  const cacheKey = `crypto-details-${id}`
  const url = `${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`

  return fetchWithCache<CryptoDetails>(url, cacheKey, forceRefresh)
}

/**
 * Fetches historical market chart data for a cryptocurrency
 *
 * @param id - The cryptocurrency ID
 * @param days - Number of days of data to fetch (default: 7)
 * @param currency - Target currency (default: "usd")
 * @param forceRefresh - If true, bypasses cache (default: false)
 * @returns Promise with CryptoMarketChart object containing prices, volumes, and market caps
 */
export async function getCryptoMarketChart(
  id: string,
  days: number | string = 7,
  currency = "usd",
  forceRefresh = false
): Promise<CryptoMarketChart> {
  const cacheKey = `crypto-chart-${id}-${days}-${currency}`
  const url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`

  return fetchWithCache<CryptoMarketChart>(url, cacheKey, forceRefresh)
}

/**
 * Fetches global cryptocurrency market data
 *
 * @param forceRefresh - If true, bypasses cache (default: false)
 * @returns Promise with GlobalMarketData object
 */
export async function getGlobalData(
  forceRefresh = false
): Promise<GlobalMarketData> {
  const cacheKey = "global-data"
  const url = `${BASE_URL}/global`

  return fetchWithCache<GlobalMarketData>(url, cacheKey, forceRefresh)
}

/**
 * Fetches trending cryptocurrencies
 *
 * @param forceRefresh - If true, bypasses cache (default: false)
 * @returns Promise with TrendingResponse object containing trending coins
 */
export async function getTrendingCoins(
  forceRefresh = false
): Promise<TrendingResponse> {
  const cacheKey = "trending-coins"
  const url = `${BASE_URL}/search/trending`

  return fetchWithCache<TrendingResponse>(url, cacheKey, forceRefresh)
}

/**
 * Clears all cached API data
 */
export function clearCache(): void {
  clearAllCache()
}

/**
 * Invalidates a specific cache entry
 *
 * @param key - The cache key to invalidate
 */
export function invalidateCacheEntry(key: string): void {
  invalidateCache(key)
}
