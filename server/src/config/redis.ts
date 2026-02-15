import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis Connected");
  } catch (error) {
    console.error("Redis Connection Error:", error);
  }
};

// --- Caching Utility ---
// Generic cache wrapper: check Redis first, then fetch & store
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>,
): Promise<T> {
  try {
    if (redisClient.isReady) {
      const cached = await redisClient.get(key);
      if (cached) {
        console.log(`[CACHE HIT] ${key}`);
        return JSON.parse(cached) as T;
      }
    }
  } catch (err) {
    console.warn(`[CACHE READ ERROR] ${key}:`, err);
  }

  // Cache miss — fetch fresh data
  const data = await fetchFn();

  try {
    if (redisClient.isReady) {
      await redisClient.set(key, JSON.stringify(data), { EX: ttlSeconds });
      console.log(`[CACHE SET] ${key} (TTL: ${ttlSeconds}s)`);
    }
  } catch (err) {
    console.warn(`[CACHE WRITE ERROR] ${key}:`, err);
  }

  return data;
}

// Invalidate a specific cache key
export async function invalidateCache(key: string): Promise<void> {
  try {
    if (redisClient.isReady) {
      await redisClient.del(key);
      console.log(`[CACHE INVALIDATED] ${key}`);
    }
  } catch (err) {
    console.warn(`[CACHE DEL ERROR] ${key}:`, err);
  }
}

// Invalidate all keys matching a pattern
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    if (redisClient.isReady) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(
          `[CACHE INVALIDATED] ${keys.length} keys matching '${pattern}'`,
        );
      }
    }
  } catch (err) {
    console.warn(`[CACHE PATTERN DEL ERROR] ${pattern}:`, err);
  }
}

// Cache TTL constants (seconds)
export const CACHE_TTL = {
  DASHBOARD: 120, // 2 min — changes frequently
  ASTEROIDS: 3600, // 1 hour
  SOLAR_WEATHER: 300, // 5 min  — important to be fresh
  SOLAR_FLARES: 300, // 5 min
  CME_EVENTS: 600, // 10 min
  AURORA_FORECAST: 300, // 5 min
  SOLAR_WIND: 120, // 2 min  — very dynamic data
  SATELLITE_TLE: 1800, // 30 min — TLEs update ~daily
  ISRO_DATA: 86400, // 24 hours — rarely changes
  MARS_DASHBOARD: 3600, // 1 hour
  MARS_WEATHER: 3600, // 1 hour
  MARS_PHOTOS: 1800, // 30 min
  SPACE_WEATHER_FULL: 180, // 3 min — aggregated weather
  APOD_TODAY: 3600, // 1 hour — APOD changes daily
  APOD_BY_DATE: 86400, // 24 hours — historical APODs never change
  NEO_FEED: 3600, // 1 hour — NEO feed by date range
  NEO_LOOKUP: 86400, // 24 hours — individual asteroid data rarely changes
  NEO_BROWSE: 3600, // 1 hour — browse pagination
};

export default redisClient;
