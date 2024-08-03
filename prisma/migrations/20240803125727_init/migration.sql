-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'FACEBOOK');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "contactFullName" TEXT NOT NULL,
    "contactMethod" "ContactMethod" NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationLat" DOUBLE PRECISION NOT NULL,
    "locationLng" DOUBLE PRECISION NOT NULL,
    "surfaceArea" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "submittedBy" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Picture" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "reportId" TEXT NOT NULL,
    "originalImageUrl" TEXT NOT NULL,
    "thumbnailImageUrl" TEXT,
    "mediumImageUrl" TEXT,
    "largeImageUrl" TEXT,
    "imageFormat" TEXT NOT NULL,
    "imageWidth" INTEGER NOT NULL,
    "imageHeight" INTEGER NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTotalSurfaceArea" (
    "userId" TEXT NOT NULL,
    "totalSurfaceArea" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserTotalSurfaceArea_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "Report_isDeleted_idx" ON "Report"("isDeleted");

-- CreateIndex
CREATE INDEX "Report_isDeleted_createdAt_idx" ON "Report"("isDeleted", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Report_isDeleted_isAccepted_idx" ON "Report"("isDeleted", "isAccepted");

-- CreateIndex
CREATE INDEX "Report_isDeleted_submittedBy_idx" ON "Report"("isDeleted", "submittedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Picture_reportId_key" ON "Picture"("reportId");

-- CreateIndex
CREATE INDEX "Picture_isDeleted_reportId_idx" ON "Picture"("isDeleted", "reportId");

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
