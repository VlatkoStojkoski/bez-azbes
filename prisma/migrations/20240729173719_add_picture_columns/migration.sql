/*
  Warnings:

  - Added the required column `pictureBucket` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureKey` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "pictureBucket" TEXT NOT NULL,
ADD COLUMN     "pictureKey" TEXT NOT NULL;
