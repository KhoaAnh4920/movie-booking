import { REDIS_SEAT_LOCK_PREFIX } from './redis.constants';

export function buildSeatLockKey(showtimeId: string, seatId: string): string {
  return `${REDIS_SEAT_LOCK_PREFIX}:${showtimeId}:seat:${seatId}`;
}
