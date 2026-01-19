/**
 * Cache Manager - Sistema de cache robusto con localStorage
 *
 * Características:
 * - TTL configurable (default: 10 minutos)
 * - Persistencia en localStorage entre sesiones
 * - Fallback a cache expirado si API falla
 * - Debug logging opcional
 */

const CACHE_PREFIX = "crypto_cache_"
const DEFAULT_TTL = 10 * 60 * 1000
const DEBUG = false

interface CacheEntry<T> {
  key: string
  data: T
  timestamp: number
  expiresAt: number
}

/**
 * Log de debug (solo si DEBUG = true)
 */
function debugLog(message: string, data?: unknown): void {
  if (DEBUG) {
    console.log(`[Cache] ${message}`, data ?? "")
  }
}

/**
 * Verifica si estamos en el cliente (navegador)
 */
function isClient(): boolean {
  return typeof window !== "undefined"
}

/**
 * Obtiene la clave completa del cache
 */
function getCacheKey(key: string): string {
  return `${CACHE_PREFIX}${key}`
}

/**
 * Obtiene datos del cache si existen y son válidos
 * @param key - Identificador único del cache
 * @returns Datos del cache o null si no existe/expirado
 */
export function getCachedData<T>(key: string): T | null {
  if (!isClient()) return null

  try {
    const cacheKey = getCacheKey(key)
    const cached = localStorage.getItem(cacheKey)

    if (!cached) {
      debugLog(`MISS - No existe: ${key}`)
      return null
    }

    const entry: CacheEntry<T> = JSON.parse(cached)
    const now = Date.now()

    if (now < entry.expiresAt) {
      const remainingTime = Math.round((entry.expiresAt - now) / 1000)
      debugLog(`HIT - ${key} (expira en ${remainingTime}s)`)
      return entry.data
    }

    debugLog(`EXPIRED - ${key}`)
    return null
  } catch (error) {
    debugLog(`ERROR leyendo cache: ${key}`, error)
    return null
  }
}

/**
 * Guarda datos en el cache
 * @param key - Identificador único del cache
 * @param data - Datos a guardar
 * @param ttl - Time To Live en milisegundos (default: 10 min)
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
    debugLog(`ERROR guardando cache: ${key}`, error)
    if (error instanceof Error && error.name === "QuotaExceededError") {
      clearExpiredCache()
    }
  }
}

/**
 * Obtiene datos expirados del cache (para fallback)
 * @param key - Identificador único del cache
 * @returns Datos del cache aunque estén expirados, o null si no existen
 */
export function getExpiredCacheData<T>(key: string): T | null {
  if (!isClient()) return null

  try {
    const cacheKey = getCacheKey(key)
    const cached = localStorage.getItem(cacheKey)

    if (!cached) return null

    const entry: CacheEntry<T> = JSON.parse(cached)
    debugLog(`FALLBACK - Usando cache expirado: ${key}`)
    return entry.data
  } catch (error) {
    return null
  }
}

/**
 * Verifica si el cache para una clave es válido
 * @param key - Identificador único del cache
 * @returns true si el cache existe y no está expirado
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
 * Invalida (elimina) una entrada específica del cache
 * @param key - Identificador único del cache
 */
export function invalidateCache(key: string): void {
  if (!isClient()) return

  try {
    const cacheKey = getCacheKey(key)
    localStorage.removeItem(cacheKey)
    debugLog(`INVALIDATE - ${key}`)
  } catch (error) {
    debugLog(`ERROR invalidando cache: ${key}`, error)
  }
}

/**
 * Limpia todo el cache de la aplicación
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
    debugLog(`CLEAR ALL - ${keysToRemove.length} entradas eliminadas`)
  } catch (error) {
    debugLog("ERROR limpiando cache", error)
  }
}

/**
 * Limpia solo las entradas expiradas del cache
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
    debugLog(`CLEAR EXPIRED - ${keysToRemove.length} entradas eliminadas`)
  } catch (error) {
    debugLog("ERROR limpiando cache expirado", error)
  }
}

/**
 * Obtiene estadísticas del cache
 * @returns Objeto con estadísticas del cache
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
          totalBytes += cached.length * 2
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
