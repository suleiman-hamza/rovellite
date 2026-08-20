// Redis Cache Utility
// Uses Nitro's built-in Unstorage layer with Redis driver.
// Falls back to in-memory storage when Redis is not configured.
//

// import type { Storage } from 'unstorage'

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  /** Biller groups change very rarely — cache for 6 hours */
  BILLER_GROUP: 6 * 60 * 60,
  /** Packages change infrequently — cache for 1 hour */
  PACKAGES: 1 * 60 * 60,
  /** Customer lookup is transient — cache for 10 minutes */
  CUSTOMER_LOOKUP: 10 * 60,
  /** Subscription plans catalog — cache for 15 minutes */
  SUBSCRIPTION_PLANS: 15 * 60,
  /** Cart validation result — cache for 20 minutes (matches expiresAt) */
  CART_VALIDATION: 20 * 60,
} as const

// Cache key prefixes
const PREFIX = {
  BILLER_GROUP_ID: 'coralpay:biller-group:id',
  BILLER_GROUP_SLUG: 'coralpay:biller-group:slug',
  PACKAGES_ID: 'coralpay:packages:id',
  PACKAGES_SLUG: 'coralpay:packages:slug',
  CUSTOMER_LOOKUP: 'coralpay:customer-lookup',
  CART_VALIDATION: 'cart:validation',
} as const

/**
 * Retrieve the Nitro cache storage instance.
 * Nitro automatically configures the storage driver based on `nitro.storage`
 * in nuxt.config.ts. When no Redis driver is configured, it defaults to
 * in-memory storage — no runtime errors.
 */
function getCacheStorage() {
  return useStorage('redis')
}

// Generic Cache Helpers

/**
 * Get a cached value, or execute the fetcher and cache the result.
 * Thread-safe: if the fetcher throws, nothing is cached.
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number,
): Promise<T> {
  const storage = getCacheStorage()

  try {
    const cached = await storage.getItem<T>(key)
    if (cached !== null && cached !== undefined) {
      return cached
    }
  }
  catch (error) {
    // Cache read failure — proceed to fetch
    console.warn('[redis-cache] Cache read error, falling back to fetch:', (error as Error).message)
  }

  const freshData = await fetcher()

  if (freshData !== undefined && freshData !== null) {
    try {
      await storage.setItem(key, freshData as any, { ttl: ttlSeconds })
    }
    catch (error) {
      // Cache write failure — non-fatal, data is still returned
      console.warn('[redis-cache] Cache write error:', (error as Error).message)
    }
  }

  return freshData
}

/**
 * Invalidate a specific cache key.
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    const storage = getCacheStorage()
    await storage.removeItem(key)
  }
  catch (error) {
    console.warn('[redis-cache] Cache invalidation error:', (error as Error).message)
  }
}

/**
 * Invalidate all cache keys matching a prefix.
 */
export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
  try {
    const storage = getCacheStorage()
    const keys = await storage.getKeys(prefix)
    await Promise.all(keys.map(k => storage.removeItem(k)))
  }
  catch (error) {
    console.warn('[redis-cache] Prefix invalidation error:', (error as Error).message)
  }
}

// Domain-Specific Cache Keys
export const cacheKeys = {
  billerGroupById: (id: string | number) => `${PREFIX.BILLER_GROUP_ID}:${id}`,
  billerGroupBySlug: (slug: string) => `${PREFIX.BILLER_GROUP_SLUG}:${slug}`,
  packagesById: (id: string | number) => `${PREFIX.PACKAGES_ID}:${id}`,
  packagesBySlug: (slug: string) => `${PREFIX.PACKAGES_SLUG}:${slug}`,
  customerLookup: (billerSlug: string, customerId: string | number) =>
    `${PREFIX.CUSTOMER_LOOKUP}:${billerSlug}:${customerId}`,
  subscriptionPlans: (queryStr: string) => `subscription-plans:${queryStr}`,
  cartValidation: (planId: string, targetIdentifier: string, amount?: number) =>
    `${PREFIX.CART_VALIDATION}:${planId}:${targetIdentifier}${amount !== undefined ? `:${amount}` : ''}`,
} as const
