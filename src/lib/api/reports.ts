import { createErrorResponse, createResponse } from "@/utils/api";
import { waitTime } from "@/utils/general";

import { NewReport } from "./reports.model";
import { reports } from "./test-data";

export async function createReport(data: NewReport) {
	await waitTime(1000);

	return createResponse(data);
}

export async function getReports() {
	await waitTime(1000);

	return createResponse(reports);
}

export async function getReport(id: string) {
	await waitTime(1000);

	return createResponse(reports.find((r) => r.id === id));
}

export async function updateReport(id: string, data: NewReport) {
	await waitTime(1000);

	const report = reports.find((r) => r.id === id);

	if (!report) {
		return createErrorResponse('Report not found');
	}

	Object.assign(report, data);

	return createResponse(report);
}

export async function deleteReport(id: string) {
	await waitTime(1000);

	const index = reports.findIndex((r) => r.id === id);

	if (index === -1) {
		return createErrorResponse('Report not found');
	}

	return createResponse(reports.splice(index, 1));
}