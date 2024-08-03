-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "surfaceArea" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UserTotalSurfaceArea" (
    "userId" TEXT NOT NULL,
    "totalSurfaceArea" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserTotalSurfaceArea_pkey" PRIMARY KEY ("userId")
);

-- Create a function to update the total surface area
CREATE OR REPLACE FUNCTION update_total_surface_area() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO UserTotalSurfaceArea (userId, totalSurfaceArea)
    VALUES (NEW.submittedBy, NEW.surfaceArea)
    ON CONFLICT (userId)
    DO UPDATE SET totalSurfaceArea = UserTotalSurfaceArea.totalSurfaceArea + NEW.surfaceArea;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE UserTotalSurfaceArea
    SET totalSurfaceArea = totalSurfaceArea - OLD.surfaceArea + NEW.surfaceArea
    WHERE userId = NEW.submittedBy;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE UserTotalSurfaceArea
    SET totalSurfaceArea = totalSurfaceArea - OLD.surfaceArea
    WHERE userId = OLD.submittedBy;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for insert, update, and delete on the Report table
CREATE TRIGGER report_insert
AFTER INSERT ON Report
FOR EACH ROW EXECUTE FUNCTION update_total_surface_area();

CREATE TRIGGER report_update
AFTER UPDATE ON Report
FOR EACH ROW EXECUTE FUNCTION update_total_surface_area();

CREATE TRIGGER report_delete
AFTER DELETE ON Report
FOR EACH ROW EXECUTE FUNCTION update_total_surface_area();
