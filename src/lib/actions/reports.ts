'use server';

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { createReport as createReportApi } from "@/lib/api/reports";
import { ClientReport, newReportSchema } from "@/lib/api/reports.model";
import { ApiResponse, createErrorResponse } from "@/utils/api";

export async function createReport(prevState: unknown, formData: unknown): Promise<ApiResponse<ClientReport>> {
	const { data: reportData, error, success } = newReportSchema.safeParse(formData);

	if (success === false) {
		return createErrorResponse<ClientReport, { message: string; errors: z.ZodError['errors'] }>(
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

	const res = await createReportApi(reportData);

	return res;
}
