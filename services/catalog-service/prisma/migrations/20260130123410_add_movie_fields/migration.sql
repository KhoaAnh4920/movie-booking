/*
  Warnings:

  - Added the required column `durationMinutes` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;
