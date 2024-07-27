import { ReportForm } from "./report-form";

export default function NewReportPage() {
	return (
		<div className="px-4 sm:px-6 py-12 container max-w-screen-sm">
			<div className="rounded-lg bg-background-secondary border p-6">
				<h1 className="text-2xl sm:text-3xl text-center font-bold mb-6">
					Пријави Азбест
				</h1>
				<ReportForm />
			</div>
		</div>
	);
}