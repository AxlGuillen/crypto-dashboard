/**
 * Cache Manager - Robust caching system with localStorage persistence
 *
 * Features:
 * - Configurable TTL (default: 10 minutes)
 * - Persistence across browser sessions via localStorage
 * - Fallback to expired cache when API fails
 * - Optional debug logging
 */

const CACHE_PREFIX = "crypto_cache_"
const DEFAULT_TTL = 10 * 60 * 1000 // 10 minutes in milliseconds
const DEBUG = false // Set to true to enable debug logging

interface CacheEntry<T> {
  key: string
  data: T
  timestamp: number
  expiresAt: number
}

/**
 * Logs debug messages to console (only when DEBUG is true)
 *
 * @param message - The message to log
 * @param data - Optional data to include in the log
 */
function debugLog(message: string, data?: unknown): void {
  if (DEBUG) {
    console.log(`[Cache] ${message}`, data ?? "")
  }
}

/**
 * Checks if code is running in a browser environment
 *
 * @returns True if running in browser, false otherwise
 */
function isClient(): boolean {
  return typeof window !== "undefined"
}

/**
 * Generates the full cache key with prefix
 *
 * @param key - The base cache key
 * @returns The prefixed cache key
 */
function getCacheKey(key: string): string {
  return `${CACHE_PREFIX}${key}`
}

/**
 * Retrieves data from cache if it exists and is valid (not expired)
 *
 * @param key - Unique cache identifier
 * @returns Cached data or null if not found/expired
 */
export function getCachedData<T>(key: string): T | null {
  if (!isClient()) return null

  try {
    const cacheKey = getCacheKey(key)
    const cached = localStorage.getItem(cacheKey)

    if (!cached) {
      debugLog(`MISS - Does not exist: ${key}`)
      return null
    }

    const entry: CacheEntry<T> = JSON.parse(cached)
    const now = Date.now()

    if (now < entry.expiresAt) {
      const remainingTime = Math.round((entry.expiresAt - now) / 1000)
      debugLog(`HIT - ${key} (expires in ${remainingTime}s)`)
      return entry.data
    }

    debugLog(`EXPIRED - ${key}`)
    return null
  } catch (error) {
    debugLog(`ERROR reading cache: ${key}`, error)
    return null
  }
}

/**
 * Saves data to cache with specified TTL
 *
 * @param key - Unique cache identifier
 * @param data - Data to cache
 * @param ttl - Time To Live in milliseconds (default: 10 minutes)
 */
export function setCachedData<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (!isClient()) return

  try {
    const cacheKey = getCacheKey(key)
    const now = Date.now()

    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: now,
      expiresAt: now + ttl,
    }

    localStorage.setItem(cacheKey, JSON.stringify(entry))
    debugLog(`SET - ${key} (TTL: ${ttl / 1000}s)`)
  } catch (error) {
    debugLog(`ERROR saving cache: ${key}`, error)
    // If localStorage is full, clear expired entries
    if (error instanceof Error && error.name === "QuotaExceededError") {
      clearExpiredCache()
    }
  }
}

/**
 * Retrieves expired cache data for fallback purposes
 *
 * @param key - Unique cache identifier
 * @returns Cached data even if expired, or null if not found
 */
export function getExpiredCacheData<T>(key: string): T | null {
  if (!isClient()) return null

  try {
    const cacheKey = getCacheKey(key)
    const cached = localStorage.getItem(cacheKey)

    if (!cached) return null

    const entry: CacheEntry<T> = JSON.parse(cached)
    debugLog(`FALLBACK - Using expired cache: ${key}`)
    return entry.data
  } catch (error) {
    return null
  }
}

/**
 * Checks if cache for a given key is valid (exists and not expired)
 *
 * @param key - Unique cache identifier
 * @returns True if cache exists and is not expired
 */
export function isCacheValid(key: string): boolean {
  if (!isClient()) return false

  try {
    const cacheKey = getCacheKey(key)
    const cached = localStorage.getItem(cacheKey)

    if (!cached) return false

    const entry: CacheEntry<unknown> = JSON.parse(cached)
    return Date.now() < entry.expiresAt
  } catch (error) {
    return false
  }
}

/**
 * Invalidates (removes) a specific cache entry
 *
 * @param key - Unique cache identifier to invalidate
 */
export function invalidateCache(key: string): void {
  if (!isClient()) return

  try {
    const cacheKey = getCacheKey(key)
    localStorage.removeItem(cacheKey)
    debugLog(`INVALIDATE - ${key}`)
  } catch (error) {
    debugLog(`ERROR invalidating cache: ${key}`, error)
  }
}

/**
 * Clears all cache entries for this application
 */
export function clearAllCache(): void {
  if (!isClient()) return

  try {
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
    debugLog(`CLEAR ALL - ${keysToRemove.length} entries removed`)
  } catch (error) {
    debugLog("ERROR clearing cache", error)
  }
}

/**
 * Clears only expired cache entries
 */
export function clearExpiredCache(): void {
  if (!isClient()) return

  try {
    const now = Date.now()
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(CACHE_PREFIX)) {
        const cached = localStorage.getItem(key)
        if (cached) {
          const entry: CacheEntry<unknown> = JSON.parse(cached)
          if (now >= entry.expiresAt) {
            keysToRemove.push(key)
          }
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
    debugLog(`CLEAR EXPIRED - ${keysToRemove.length} entries removed`)
  } catch (error) {
    debugLog("ERROR clearing expired cache", error)
  }
}

/**
 * Returns cache statistics
 *
 * @returns Object containing total, valid, and expired entry counts plus total size
 */
export function getCacheStats(): {
  totalEntries: number
  validEntries: number
  expiredEntries: number
  totalSize: string
} {
  if (!isClient()) {
    return { totalEntries: 0, validEntries: 0, expiredEntries: 0, totalSize: "0 KB" }
  }

  try {
    const now = Date.now()
    let totalEntries = 0
    let validEntries = 0
    let expiredEntries = 0
    let totalBytes = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(CACHE_PREFIX)) {
        totalEntries++
        const cached = localStorage.getItem(key)
        if (cached) {
          totalBytes += cached.length * 2 // UTF-16 encoding
          const entry: CacheEntry<unknown> = JSON.parse(cached)
          if (now < entry.expiresAt) {
            validEntries++
          } else {
            expiredEntries++
          }
        }
      }
    }

    const totalSize = totalBytes > 1024
      ? `${(totalBytes / 1024).toFixed(2)} KB`
      : `${totalBytes} B`

    return { totalEntries, validEntries, expiredEntries, totalSize }
  } catch (error) {
    return { totalEntries: 0, validEntries: 0, expiredEntries: 0, totalSize: "0 KB" }
  }
}
