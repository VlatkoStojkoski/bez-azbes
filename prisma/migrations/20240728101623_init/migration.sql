-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'FACEBOOK');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactFullName" TEXT NOT NULL,
    "contactMethod" "ContactMethod" NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationLat" DOUBLE PRECISION NOT NULL,
    "locationLng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
