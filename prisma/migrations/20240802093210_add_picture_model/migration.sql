-- Step 1: Create the Picture table
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
    "mimeType" TEXT NOT NULL,
    "imageWidth" INTEGER NOT NULL,
    "imageHeight" INTEGER NOT NULL,
    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- Step 2: Create Pictures for existing Reports
INSERT INTO "Picture" ("id", "reportId", "originalImageUrl", "mimeType", "imageWidth", "imageHeight", "updatedAt")
SELECT 
    gen_random_uuid()::TEXT as "id",
    "id" as "reportId",
    CONCAT('bez-azbest-pics.s3.eu-central-1.amazonaws.com/', "pictureKey") as "originalImageUrl",
    'image/jpeg' as "mimeType", -- Assuming JPEG, adjust if needed
    800 as "imageWidth", -- Placeholder value, adjust as needed
    600 as "imageHeight", -- Placeholder value, adjust as needed
    CURRENT_TIMESTAMP as "updatedAt"
FROM "Report"
WHERE "pictureKey" IS NOT NULL;

-- Step 3: Drop columns from Report table
ALTER TABLE "Report" DROP COLUMN IF EXISTS "pictureBucket",
                     DROP COLUMN IF EXISTS "pictureKey";

-- Step 4: Create indexes
CREATE UNIQUE INDEX "Picture_reportId_key" ON "Picture"("reportId");
CREATE INDEX "Picture_isDeleted_reportId_idx" ON "Picture"("isDeleted", "reportId");
CREATE INDEX "Report_isDeleted_idx" ON "Report"("isDeleted");
CREATE INDEX "Report_isDeleted_createdAt_idx" ON "Report"("isDeleted", "createdAt" DESC);
CREATE INDEX "Report_isDeleted_isAccepted_idx" ON "Report"("isDeleted", "isAccepted");
CREATE INDEX "Report_isDeleted_submittedBy_idx" ON "Report"("isDeleted", "submittedBy");

-- Step 5: Add foreign key constraint
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 6: Update the updatedAt timestamps for Reports
UPDATE "Report" SET "updatedAt" = CURRENT_TIMESTAMP;