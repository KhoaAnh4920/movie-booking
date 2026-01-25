import 'dotenv/config';
import { PrismaClient, BookingStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const catalogDbUrl = process.env.DATABASE_URL.replace(
  'booking_db',
  'catalog_db',
);

const catalogPool = new Pool({
  connectionString: catalogDbUrl,
});

async function main() {
  let showtimes: any[] = [];
  try {
    const res = await catalogPool.query('SELECT * FROM "Showtime" LIMIT 100');
    showtimes = res.rows;
  } catch (e) {
    console.log('Error querying Showtime:', e);
    try {
      const res = await catalogPool.query('SELECT * FROM "showtime" LIMIT 100');
      showtimes = res.rows;
    } catch (e2) {
      console.log('Error querying showtime:', e2);
      return;
    }
  }

  if (showtimes.length === 0) {
    return;
  }

  const users = [
    'user-001',
    'user-002',
    'user-003',
    'user-004',
    'user-005',
    'user-006',
    'user-007',
    'user-008',
    'user-009',
    'user-010',
    'user-011',
    'user-012',
    'user-013',
    'user-014',
    'user-015',
  ];

  for (let i = 0; i < showtimes.length; i++) {
    const showtime = showtimes[i];

    for (let j = 0; j < 5; j++) {
      let seats: any[] = [];
      try {
        const offset = i * 20 + j * 5;
        const res = await catalogPool.query(
          `SELECT * FROM "Seat" WHERE "hallId" = $1 LIMIT 5 OFFSET $2`,
          [showtime.hallId, offset],
        );
        seats = res.rows;
      } catch (e) {
        console.log('Error querying Seat:', e);
        continue;
      }

      if (seats.length < 2) {
        continue;
      }

      const bookingUser = users[(i + j) % users.length];

      const booking = await prisma.booking.create({
        data: {
          userId: bookingUser,
          showtimeId: showtime.id,
          status:
            Math.random() > 0.2
              ? BookingStatus.CONFIRMED
              : BookingStatus.PENDING,
          totalAmount: 0,
          tickets: {
            create: seats
              .slice(0, Math.floor(Math.random() * 3) + 1)
              .map((seat) => ({
                seatId: seat.id,
                seatRow: seat.rowCode,
                seatNumber: seat.seatNumber,
                price: seat.type === 'VIP' ? 150000 : 100000,
              })),
          },
        },
        include: {
          tickets: true,
        },
      });

      const total = booking.tickets.reduce(
        (sum, t) => sum + Number(t.price),
        0,
      );
      await prisma.booking.update({
        where: { id: booking.id },
        data: { totalAmount: total },
      });
    }
  }
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await catalogPool.end();
  });
