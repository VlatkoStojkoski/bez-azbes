/*
  Warnings:

  - You are about to drop the column `mimeType` on the `Picture` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Picture" DROP COLUMN "mimeType",
ADD COLUMN     "imageFormat" TEXT NOT NULL DEFAULT 'jpeg';
