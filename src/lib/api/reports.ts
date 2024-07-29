import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { ZodError } from "zod";

import { ApiResponse, createErrorResponse, createResponse } from "@/utils/api";
import { waitTime } from "@/utils/general";

import { DBReport, NewReport } from "./reports.model";
import { s3Client } from './s3';
import { reports } from "./test-data";


export type ApiCreateReportResponse = ApiResponse<Partial<DBReport>, { message: string, errors?: ZodError['errors'] }>;

export async function createReport(data: NewReport): Promise<ApiCreateReportResponse> {
	await waitTime(1000);

	let report = reports[0];

	const res = await s3Client.send(new ListBucketsCommand({}));

	console.log(
		'bucket list',
		res.Buckets?.map(b => b.Name)
	);

	return createResponse(report);
}

export async function getReports() {
	await waitTime(1000);

	return createResponse(reports as DBReport[]);
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