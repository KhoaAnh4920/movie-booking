export const REDIS_SEAT_LOCK_TTL =
  Number(process.env.REDIS_SEAT_LOCK_TTL_SECONDS) || 600;
