import { ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from "zod";


import { env } from "@/env";
import prisma from "@/lib/api/db";
import { createReport as createReportApi } from "@/lib/api/reports";
import { DBReport, NewReport, newReportSchema } from "@/lib/api/reports.model";
import { s3Client } from "@/lib/api/s3";
import { ApiResponse, createErrorResponse, createResponse } from "@/utils/api";
import { waitTime } from "@/utils/general";

import { reports } from "./test-data";


export type ApiCreateReportResponse = ApiResponse<DBReport, { message: string, errors?: ZodError['errors'] }>;

export async function createReport(reportData: NewReport, {
	userId,
}: {
	userId: string,
}): Promise<ApiCreateReportResponse> {
	const reportId = uuidv4();

	console.log('GENERATED REPORT ID:', reportId);

	const pictureData = await reportData.picture[0].text();

	const picturePutCommand = new PutObjectCommand({
		Bucket: env.AWS_S3_PICS_BUCKET,
		Key: `${reportId}`,
		Body: pictureData,
		ContentEncoding: 'base64',
	});

	const pictureUploadResult = await s3Client.send(picturePutCommand);

	console.log('PICTURE UPLOAD RESULT:', pictureUploadResult);

	if (pictureUploadResult.$metadata.httpStatusCode !== 200) {
		return createErrorResponse('Грешка при прикачување на сликата');
	}

	const newReportRes = await prisma.report.create({
		data: {
			id: reportId,
			contactFullName: reportData.fullName,
			contactMethod: reportData.contactMethod,
			contactInfo: reportData.contactInfo,
			address: reportData.address,
			description: reportData.description,
			locationLat: reportData.locationLat,
			locationLng: reportData.locationLng,
			pictureBucket: env.AWS_S3_PICS_BUCKET,
			pictureKey: reportId,
			submittedBy: userId,
		}
	});

	console.log('NEW REPORT RES:', newReportRes);

	return createResponse(newReportRes);
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