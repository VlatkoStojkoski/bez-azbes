import { MapView } from "@/components/map-view";
import { ClientReport } from "@/lib/api/reports.model";

export function ReportsMap({ allReports }: {
	allReports: ClientReport[];
}) {
	return (
		<MapView
			className="w-full h-full"
			reports={allReports}
		/>
	);
}