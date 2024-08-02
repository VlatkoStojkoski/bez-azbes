import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getReports } from "@/lib/api/reports";

import { ReportsList } from "./reports-list";
import { ReportsMap } from "./reports-map";

export default async function AdminDashboard() {
	const reports = await getReports({ sort: 'newest' });

	return (
		<div className="w-full h-full flex justify-center py-6">
			{
				reports.success === true && (
					<Tabs defaultValue="list" className="w-full h-full">
						<TabsList className="mx-auto w-full max-w-xl grid grid-cols-2 h-auto">
							<TabsTrigger value="list" className="text-lg sm:text-xl">Листа</TabsTrigger>
							<TabsTrigger value="map" className="text-lg sm:text-xl">Мапа</TabsTrigger>
						</TabsList>
						<TabsContent value="list">
							<ReportsList allReports={reports.data.reports} />
						</TabsContent>
						<TabsContent value="map" className="w-full h-full">
							<ReportsMap allReports={reports.data.reports} />
						</TabsContent>
					</Tabs>
				)
			}
		</div>
	);
}