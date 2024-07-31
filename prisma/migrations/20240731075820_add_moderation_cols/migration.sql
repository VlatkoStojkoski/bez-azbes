-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
