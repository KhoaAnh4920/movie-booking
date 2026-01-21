/*
  Warnings:

  - You are about to drop the `Cinema` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hall` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Showtime` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Hall" DROP CONSTRAINT "Hall_cinemaId_fkey";

-- DropForeignKey
ALTER TABLE "MovieVersion" DROP CONSTRAINT "MovieVersion_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_hallId_fkey";

-- DropForeignKey
ALTER TABLE "Showtime" DROP CONSTRAINT "Showtime_hallId_fkey";

-- DropTable
DROP TABLE "Cinema";

-- DropTable
DROP TABLE "Hall";

-- DropTable
DROP TABLE "Movie";

-- DropTable
DROP TABLE "MovieVersion";

-- DropTable
DROP TABLE "Seat";

-- DropTable
DROP TABLE "Showtime";

-- DropEnum
DROP TYPE "MovieStatus";

-- DropEnum
DROP TYPE "SeatType";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showtimeId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "totalAmount" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "seatRow" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "price" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_showtimeId_idx" ON "Booking"("showtimeId");

-- CreateIndex
CREATE INDEX "Ticket_bookingId_idx" ON "Ticket"("bookingId");

-- CreateIndex
CREATE INDEX "Ticket_seatId_idx" ON "Ticket"("seatId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
