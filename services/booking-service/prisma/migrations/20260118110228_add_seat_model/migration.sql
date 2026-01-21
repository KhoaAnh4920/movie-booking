-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('STANDARD', 'VIP', 'COUPLE');

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "hallId" TEXT NOT NULL,
    "rowCode" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "gridRow" INTEGER NOT NULL,
    "gridCol" INTEGER NOT NULL,
    "type" "SeatType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_hallId_rowCode_seatNumber_key" ON "Seat"("hallId", "rowCode", "seatNumber");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
