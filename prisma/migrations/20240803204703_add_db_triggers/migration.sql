-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "isCalculated" BOOLEAN NOT NULL DEFAULT false;

-- Function to update UserTotalSurfaceArea
CREATE OR REPLACE FUNCTION update_user_total_surface_area()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."isAccepted" = true AND NEW."isDeleted" = false AND NEW."isCalculated" = false THEN
        -- Add surface area to UserTotalSurfaceArea, create if not exists
        INSERT INTO "UserTotalSurfaceArea" ("userId", "totalSurfaceArea")
        VALUES (NEW."submittedBy", NEW."surfaceArea")
        ON CONFLICT ("userId")
        DO UPDATE SET "totalSurfaceArea" = "UserTotalSurfaceArea"."totalSurfaceArea" + NEW."surfaceArea";

        -- Set isCalculated to true
        NEW."isCalculated" := true;
    ELSIF (OLD."isCalculated" = true AND NEW."isDeleted" = true) OR
          (OLD."isCalculated" = true AND NEW."isAccepted" = false) THEN
        -- Subtract surface area from UserTotalSurfaceArea, if exists
        UPDATE "UserTotalSurfaceArea"
        SET "totalSurfaceArea" = GREATEST(0, "totalSurfaceArea" - OLD."surfaceArea")
        WHERE "userId" = OLD."submittedBy";

        -- If totalSurfaceArea becomes 0, optionally remove the record
        DELETE FROM "UserTotalSurfaceArea"
        WHERE "userId" = OLD."submittedBy" AND "totalSurfaceArea" = 0;

        -- Set isCalculated to false
        NEW."isCalculated" := false;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updates on Report
CREATE TRIGGER update_user_total_surface_area_trigger
BEFORE UPDATE ON "Report"
FOR EACH ROW
EXECUTE FUNCTION update_user_total_surface_area();

-- Function to handle hard deletions
CREATE OR REPLACE FUNCTION handle_report_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD."isCalculated" = true THEN
        -- Subtract surface area from UserTotalSurfaceArea, if exists
        UPDATE "UserTotalSurfaceArea"
        SET "totalSurfaceArea" = GREATEST(0, "totalSurfaceArea" - OLD."surfaceArea")
        WHERE "userId" = OLD."submittedBy";

        -- If totalSurfaceArea becomes 0, optionally remove the record
        DELETE FROM "UserTotalSurfaceArea"
        WHERE "userId" = OLD."submittedBy" AND "totalSurfaceArea" = 0;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for deletions on Report
CREATE TRIGGER handle_report_deletion_trigger
BEFORE DELETE ON "Report"
FOR EACH ROW
EXECUTE FUNCTION handle_report_deletion();