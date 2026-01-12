/*
  Warnings:

  - You are about to drop the column `durationMinutes` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `Showtime` table. All the data in the column will be lost.
  - Added the required column `movieVersionId` to the `Showtime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "durationMinutes",
DROP COLUMN "releaseDate";

-- AlterTable
ALTER TABLE "Showtime" DROP COLUMN "movieId",
ADD COLUMN     "movieVersionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MovieVersion" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "versionType" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovieVersion_movieId_idx" ON "MovieVersion"("movieId");

-- CreateIndex
CREATE INDEX "Showtime_movieVersionId_idx" ON "Showtime"("movieVersionId");

-- AddForeignKey
ALTER TABLE "MovieVersion" ADD CONSTRAINT "MovieVersion_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
