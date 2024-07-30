import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ReportForm, ReportFormProps } from "./report-form";

export default async function NewReportPage() {
	const currUser = await currentUser();
	if (!currUser) {
		return redirect('/sign-in');
	}

	const defaults: ReportFormProps['defaults'] = {
		contactMethod: currUser.privateMetadata?.preffered?.contactMethod,
		contactInfo: currUser.privateMetadata?.preffered?.contactInfo,
		name: currUser?.fullName ?? '',
	};

	return (
		<div className="px-4 sm:px-6 py-12 container max-w-screen-sm">
			<div className="rounded-lg bg-background-secondary border p-6">
				<h1 className="text-2xl sm:text-3xl text-center font-bold mb-6">
					Пријави Азбест
				</h1>
				<ReportForm defaults={defaults} />
			</div>
		</div>
	);
}