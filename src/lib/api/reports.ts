'use server';

import { GetObjectCommand, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {
	S3RequestPresigner,
	getSignedUrl,
} from "@aws-sdk/s3-request-presigner";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { fileTypeFromBuffer } from 'file-type';
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

	const pictureArrayBuffer = await reportData.picture[0].arrayBuffer();

	const pictureBuffer = Buffer.from(pictureArrayBuffer);

	const fileType = await fileTypeFromBuffer(pictureBuffer);

	if (!fileType || !fileType.mime || fileType.mime.split('/')[0] !== 'image') {
		return createErrorResponse('Невалиден формат на сликата.');
	}

	const contentType = fileType.mime;

	const picturePutCommand = new PutObjectCommand({
		Bucket: env.AWS_S3_PICS_BUCKET,
		Key: `${reportId}`,
		Body: pictureBuffer,
		ContentType: contentType,
	});

	const pictureUploadResult = await s3Client.send(picturePutCommand);

	console.log('PICTURE UPLOAD RESULT:', pictureUploadResult);

	if (pictureUploadResult.$metadata.httpStatusCode !== 200) {
		return createErrorResponse('Грешка при прикачување на сликата.');
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

export async function getAllReports() {
	await waitTime(1000);

	return createResponse(reports as DBReport[]);
}

export async function getUsersReports(userId: string): Promise<ApiResponse<DBReport[]>> {
	try {
		const reports = await prisma.report.findMany({
			where: {
				submittedBy: userId,
			}
		});

		return createResponse(reports);
	} catch (error) {
		console.error('[getUsersReports] ERROR:', error);

		return createErrorResponse('Грешка при вчитување на вашите пријави.');
	}
}

export async function getReport(id: string): Promise<ApiResponse<DBReport>> {
	try {
		const report = await prisma.report.findUnique({
			where: {
				id,
			}
		});

		if (!report) {
			return createErrorResponse('Report not found');
		}

		return createResponse(report);
	} catch (error) {
		console.error('[getReport] ERROR:', error);

		return createErrorResponse('Грешка при вчитување на пријавата.');
	}
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

export async function getReportPictureUrl(reportData: {
	pictureBucket: string,
	pictureKey: string,
} | string): Promise<string | null> {
	let pictureBucket, pictureKey;

	if (typeof reportData === 'string') {
		const report = await getReport(reportData);

		if (!report.success) {
			return null;
		}

		pictureBucket = report.data.pictureBucket;
		pictureKey = report.data.pictureKey;
	} else {
		pictureBucket = reportData.pictureBucket;
		pictureKey = reportData.pictureKey;
	}

	const getCommand = new GetObjectCommand({
		Bucket: pictureBucket,
		Key: pictureKey,
	});

	const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 1 * 60 * 60 });

	return signedUrl;
}