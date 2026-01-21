// import 'dotenv/config';
// import { PrismaClient, MovieStatus, SeatType } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';

// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL is not defined');
// }

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });

// const prisma = new PrismaClient({ adapter });

// async function main() {
//   console.log('Seeding movie booking data...');

//   const cinemas = await Promise.all([
//     prisma.cinema.create({
//       data: {
//         name: 'CGV Landmark 81',
//         city: 'TPHCM',
//         address: 'Vinhomes Central Park, Binh Thanh',
//       },
//     }),
//     prisma.cinema.create({
//       data: {
//         name: 'CGV Vincom Dong Khoi',
//         city: 'TPHCM',
//         address: '72 Le Thanh Ton, District 1',
//       },
//     }),
//   ]);

//   const halls: { id: string }[] = [];

//   for (const cinema of cinemas) {
//     for (let i = 1; i <= 2; i++) {
//       const hall = await prisma.hall.create({
//         data: {
//           cinemaId: cinema.id,
//           name: `Hall ${i}`,
//           totalSeats: 50,
//         },
//       });

//       halls.push(hall);

//       // Seat layout: A–E, 1–10
//       const rows = ['A', 'B', 'C', 'D', 'E'];

//       for (let r = 0; r < rows.length; r++) {
//         for (let n = 1; n <= 10; n++) {
//           await prisma.seat.create({
//             data: {
//               hallId: hall.id,
//               rowCode: rows[r],
//               seatNumber: n,
//               gridRow: r,
//               gridCol: n,
//               type: n >= 9 ? SeatType.VIP : SeatType.STANDARD,
//             },
//           });
//         }
//       }
//     }
//   }

//   /* =========================
//    * 3️⃣ MOVIES
//    * ========================= */
//   const movies = await Promise.all([
//     prisma.movie.create({
//       data: {
//         title: 'Interstellar',
//         description: 'Sci-fi epic by Christopher Nolan',
//         status: MovieStatus.NOW_SHOWING,
//       },
//     }),
//     prisma.movie.create({
//       data: {
//         title: 'Inception',
//         description: 'Dream within a dream',
//         status: MovieStatus.NOW_SHOWING,
//       },
//     }),
//   ]);

//   /* =========================
//    * 4️⃣ MOVIE VERSIONS
//    * ========================= */
//   const movieVersions: {
//     id: string;
//     movieId: string;
//     versionType: string;
//   }[] = [];

//   for (const movie of movies) {
//     movieVersions.push(
//       await prisma.movieVersion.create({
//         data: {
//           movieId: movie.id,
//           versionType: '2D',
//           durationMinutes: 150,
//         },
//       }),
//     );

//     movieVersions.push(
//       await prisma.movieVersion.create({
//         data: {
//           movieId: movie.id,
//           versionType: 'IMAX',
//           durationMinutes: 165,
//         },
//       }),
//     );
//   }

//   /* =========================
//    * 5️⃣ SHOWTIMES
//    * ========================= */
//   const baseDate = new Date('2026-01-25T08:00:00Z');

//   let showtimeOffset = 0;

//   for (const hall of halls) {
//     for (const version of movieVersions) {
//       const startTime = new Date(
//         baseDate.getTime() + showtimeOffset * 60 * 60 * 1000,
//       );
//       const endTime = new Date(startTime.getTime() + 2.5 * 60 * 60 * 1000);

//       await prisma.showtime.create({
//         data: {
//           hallId: hall.id,
//           movieVersionId: version.id,
//           startTime,
//           endTime,
//           priceConfig: {
//             standard: version.versionType === 'IMAX' ? 120000 : 100000,
//             vip: version.versionType === 'IMAX' ? 180000 : 150000,
//           },
//         },
//       });

//       showtimeOffset += 3;
//     }
//   }

//   console.log('✅ Seed completed successfully');
// }

// main()
//   .catch((e) => {
//     console.error('Seed failed', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
