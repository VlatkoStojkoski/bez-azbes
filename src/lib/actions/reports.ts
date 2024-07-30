'use server';

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { ApiCreateReportResponse, createReport as createReportApi } from "@/lib/api/reports";
import { DBReport, newReportSchema } from "@/lib/api/reports.model";
import { createErrorResponse } from "@/utils/api";

export async function createReport(prevState: ApiCreateReportResponse, formData: unknown): Promise<ApiCreateReportResponse> {
	const { data: reportData, error, success } = newReportSchema.safeParse(formData);

	if (success === false) {
		return createErrorResponse<DBReport, { message: string; errors: z.ZodError['errors'] }>(
			'Невалидни податоци',
			{ errors: error.errors }
		);
	}

	const user = await currentUser();

	if (!user) {
		return createErrorResponse('Не сте најавени.');
	}

	await clerkClient.users.updateUserMetadata(user.id, {
		privateMetadata: {
			preffered: {
				contactMethod: reportData.contactMethod,
				contactInfo: reportData.contactInfo,
			}
		}
	});

	const res = await createReportApi(reportData, {
		userId: user.id,
	});

	return res;
}
