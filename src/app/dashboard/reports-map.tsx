import { MapView } from "@/components/map-view";
import type { DBReportWithPictureUrl } from "@/lib/api/reports.model";

export function ReportsMap({ allReports }: {
	allReports: DBReportWithPictureUrl[];
}) {
	return (
		<MapView
			className="w-full h-full"
			reports={allReports}
		/>
	);
}