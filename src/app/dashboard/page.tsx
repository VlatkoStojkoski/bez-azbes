import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllReports } from "@/lib/api/reports";

import { ReportsList } from "./reports-list";
import { ReportsMap } from "./reports-map";

export default async function AdminDashboard() {
	const reports = await getAllReports({ sort: 'newest' });

	return (
		<div className="w-full h-full flex justify-center">
			{
				reports.success === true && (
					<Tabs defaultValue="list" className="w-full h-full">
						<TabsList className="my-6 mx-auto w-full max-w-xl grid grid-cols-2 h-auto">
							<TabsTrigger value="list" className="text-xl">Листа</TabsTrigger>
							<TabsTrigger value="map" className="text-xl">Мапа</TabsTrigger>
						</TabsList>
						<TabsContent value="list">
							<ReportsList allReports={reports.data} />
						</TabsContent>
						<TabsContent value="map" className="w-full h-full">
							<ReportsMap allReports={reports.data} />
						</TabsContent>
					</Tabs>
				)
			}
		</div>
	);
}