'use server';

import { z } from "zod";

import { ApiCreateReportResponse, createReport as createReportApi } from "@/lib/api/reports";
import { NewReport, newReportSchema } from "@/lib/api/reports.model";
import { createErrorResponse } from "@/utils/api";

export async function createReport(prevState: ApiCreateReportResponse, formData: unknown): Promise<ApiCreateReportResponse> {
	const { data, error, success } = newReportSchema.safeParse(formData);
	if (!success) {
		return createErrorResponse<Partial<NewReport>, { message: string; errors: z.ZodError['errors'] }>(
			'Invalid data',
			{ errors: error.errors }
		);
	}
	const res = await createReportApi(data as NewReport);
	return res;
}
