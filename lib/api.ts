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
 * Función genérica para hacer fetch con sistema de cache robusto
 *
 * @param url - URL del endpoint
 * @param cacheKey - Clave única para el cache
 * @param forceRefresh - Si es true, ignora el cache y hace fetch
 * @returns Datos del API o del cache
 */
async function fetchWithCache<T>(
  url: string,
  cacheKey: string,
  forceRefresh: boolean = false
): Promise<T> {
  // 1. Si no es forceRefresh, intentar obtener del cache
  if (!forceRefresh) {
    const cached = getCachedData<T>(cacheKey)
    if (cached) {
      return cached
    }
  }

  // 2. Hacer fetch al API
  try {
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment.")
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // 3. Guardar en cache (no cachear errores)
    setCachedData(cacheKey, data)

    return data
  } catch (error) {
    // 4. Si el fetch falla, intentar usar cache expirado como fallback
    const expiredCache = getExpiredCacheData<T>(cacheKey)
    if (expiredCache) {
      console.warn(`[API] Usando cache expirado para: ${cacheKey}`)
      return expiredCache
    }

    // 5. Si no hay fallback, propagar el error
    throw error
  }
}

/**
 * Obtiene lista de criptomonedas ordenadas por market cap
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
 * Obtiene detalles de una criptomoneda específica
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
 * Obtiene datos históricos de precio para gráficos
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
 * Obtiene datos globales del mercado
 */
export async function getGlobalData(
  forceRefresh = false
): Promise<GlobalMarketData> {
  const cacheKey = "global-data"
  const url = `${BASE_URL}/global`

  return fetchWithCache<GlobalMarketData>(url, cacheKey, forceRefresh)
}

/**
 * Obtiene lista de criptomonedas en tendencia
 */
export async function getTrendingCoins(
  forceRefresh = false
): Promise<TrendingResponse> {
  const cacheKey = "trending-coins"
  const url = `${BASE_URL}/search/trending`

  return fetchWithCache<TrendingResponse>(url, cacheKey, forceRefresh)
}

/**
 * Limpia todo el cache de la aplicación
 */
export function clearCache(): void {
  clearAllCache()
}

/**
 * Invalida una entrada específica del cache
 */
export function invalidateCacheEntry(key: string): void {
  invalidateCache(key)
}
