import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getReports } from "@/lib/api/reports";

import { MapView } from "./map-view";

export default async function ViewReportsPage() {
	const reports = await getReports();
	console.log(reports);

	return (
		<>
			<MapView
				className="w-full h-full"
				reports={
					reports.success === true ? reports.data : []
				}
			/>
			<Button variant='secondary' className='fixed bottom-6 left-1/2 -translate-x-1/2 z-40 text-xl px-6 py-2 h-auto border-2 border-white' asChild>
				<Link href="/reports/new">
					Пријави
				</Link>
			</Button>
		</>
	);
}
