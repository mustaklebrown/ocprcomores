/**
 * In-Memory Rate Limiter for Next.js API Routes (e.g. login brute-force prevention)
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitRecord>();

// Cleanup stale records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of tracker.entries()) {
    if (now > record.resetTime) {
      tracker.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function rateLimit({
  identifier,
  limit = 5,
  windowMs = 15 * 60 * 1000, // 15 minutes window
}: {
  identifier: string;
  limit?: number;
  windowMs?: number;
}): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = tracker.get(identifier);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    tracker.set(identifier, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  tracker.set(identifier, record);

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}
