import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getUsersReports } from "@/lib/api/reports";

import { MapView } from "./map-view";

export default async function ViewReportsPage() {
	const currUser = await currentUser();
	if (!currUser) {
		return redirect('/sign-in');
	}

	const reportsRes = await getUsersReports(currUser.id);

	return (
		<>
			<MapView
				className="w-full h-full"
				reports={
					reportsRes.success === true ? reportsRes.data : []
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
