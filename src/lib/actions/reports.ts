import { ZodError } from "zod";

import { DBReport, NewReport } from "@/lib/api/reports.model";
import { reports } from "@/lib/api/test-data";
import { ApiResponse, createResponse } from "@/utils/api";
import { waitTime } from "@/utils/general";


export type ApiCreateReportResponse = ApiResponse<Partial<DBReport>, { message: string, errors?: ZodError['errors'] }>;

export async function createReport(prevState: ApiCreateReportResponse, formData: unknown): Promise<ApiCreateReportResponse> {
	await waitTime(1000);
	let dbData = reports[0];
	return createResponse(dbData);
}
