import { MapView } from "@/components/map-view";
import { DBReport } from "@/lib/api/reports.model";

export function ReportsMap({ allReports }: {
	allReports: DBReport[];
}) {
	return (
		<MapView
			className="w-full h-full"
			reports={allReports}
		/>
	);
}