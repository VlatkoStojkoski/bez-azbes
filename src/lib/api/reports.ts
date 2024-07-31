'use server';

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fileTypeFromBuffer } from 'file-type';
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from "zod";

import { env } from "@/env";
import prisma from "@/lib/api/db";
import { DBReport, DBReportWithPictureUrl, NewReport } from "@/lib/api/reports.model";
import { s3Client } from "@/lib/api/s3";
import { ApiResponse, createErrorResponse, createResponse } from "@/utils/api";

export type ApiCreateReportResponse = ApiResponse<DBReport, { message: string, errors?: ZodError['errors'] }>;

export async function createReport(reportData: NewReport, {
	userId,
}: {
	userId: string,
}): Promise<ApiCreateReportResponse> {
	const reportId = uuidv4();

	if (reportData?.picture && reportData.picture.length > 0) {
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

		if (pictureUploadResult.$metadata.httpStatusCode !== 200) {
			return createErrorResponse('Грешка при прикачување на сликата.');
		}
	}

	const initData = {
		id: reportId,
		contactFullName: reportData.fullName,
		contactMethod: reportData.contactMethod,
		contactInfo: reportData.contactInfo,
		address: reportData.address,
		description: reportData.description,
		locationLat: reportData.locationLat,
		locationLng: reportData.locationLng,
		submittedBy: userId,
	};

	const picData = reportData?.picture?.length ?? 0 > 0 ? {
		pictureBucket: env.AWS_S3_PICS_BUCKET,
		pictureKey: reportId,
	} : {};

	const data = {
		...initData,
		...picData,
	};

	const newReportRes = await prisma.report.create({ data });

	return createResponse(newReportRes);
}

export async function getReports(config: { skip?: number, take?: number, sort?: 'oldest' | 'newest' }): Promise<ApiResponse<DBReportWithPictureUrl[]>> {
	let defaultConfig = {
		skip: 0,
		take: 10,
		sort: 'newest',
	};

	const { skip, take, sort } = { ...defaultConfig, ...config };

	try {
		const reports = await prisma.report.findMany({
			skip,
			take,
			orderBy: {
				createdAt: sort === 'newest' ? 'desc' : 'asc',
			},
		});

		const reportsWithPictureUrl = await Promise.all(reports.map(attachPictureUrlToReport));

		return createResponse(reportsWithPictureUrl);
	} catch (error) {
		console.error('[getReports] ERROR:', error);

		return createErrorResponse('Грешка при вчитување на пријавите.');
	}
}

export async function getAllReports(config: { sort?: 'oldest' | 'newest' }): Promise<ApiResponse<DBReportWithPictureUrl[]>> {
	let defaultConfig = {
		sort: 'newest',
	};

	const { sort } = { ...defaultConfig, ...config };

	try {
		const reportsData = await prisma.report.findMany({
			orderBy: {
				createdAt: sort === 'newest' ? 'desc' : 'asc',
			},
			where: {
				isDeleted: false,
			}
		});

		const reportsWithPictureUrl = await Promise.all(reportsData.map(attachPictureUrlToReport));

		return createResponse(reportsWithPictureUrl);
	} catch (error) {
		console.error('[getAllReports] ERROR:', error);

		return createErrorResponse('Грешка при вчитување на пријавите.');
	}
}

export async function getUsersReports(userId: string): Promise<ApiResponse<DBReportWithPictureUrl[]>> {
	try {
		const reports = await prisma.report.findMany({
			where: {
				submittedBy: userId,
				isDeleted: false,
			}
		});

		const reportsWithPictureUrl = await Promise.all(reports.map(attachPictureUrlToReport));

		return createResponse(reportsWithPictureUrl);
	} catch (error) {
		console.error('[getUsersReports] ERROR:', error);

		return createErrorResponse('Грешка при вчитување на вашите пријави.');
	}
}

export async function getReport(id: string): Promise<ApiResponse<DBReportWithPictureUrl>> {
	try {
		const report = await prisma.report.findUnique({
			where: {
				id,
			}
		});

		if (!report) {
			return createErrorResponse('Report not found');
		}

		const reportWithPictureUrl = await attachPictureUrlToReport(report);

		return createResponse(reportWithPictureUrl);
	} catch (error) {
		console.error('[getReport] ERROR:', error);

		return createErrorResponse('Грешка при вчитување на пријавата.');
	}
}

export async function updateReport(id: string, data: Partial<DBReportWithPictureUrl>): Promise<ApiResponse<DBReportWithPictureUrl>> {
	try {
		const report = await prisma.report.update({
			data: {
				...data,
			},
			where: {
				id,
			}
		});

		if (!report) {
			return createErrorResponse('Пријавата не е пронајдена.');
		}

		const reportWithPictureUrl = await attachPictureUrlToReport(report);

		return createResponse(reportWithPictureUrl);
	} catch (error) {
		console.error('[updateReport] ERROR:', error);

		return createErrorResponse('Грешка при ажурирање на пријавата.');
	}
}

export async function deleteReport(id: string) {
	try {
		const deleteRes = await prisma.report.update({
			data: {
				isDeleted: true,
			},
			where: {
				id,
			},
		});

		return createResponse(deleteRes);
	} catch (error) {
		console.error('[deleteReport] ERROR:', error);

		return createErrorResponse('Грешка при бришење на пријавата.');
	}
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

		if (!pictureBucket || !pictureKey) {
			return null;
		}
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

export async function acceptReport(reportId: string): Promise<ApiResponse<DBReportWithPictureUrl>> {
	const res = await updateReport(reportId, {
		isAccepted: true,
	});

	return res;
}

export async function rejectReport(reportId: string): Promise<ApiResponse<DBReportWithPictureUrl>> {
	const res = await updateReport(reportId, {
		isAccepted: false,
	});

	return res;
}

export async function attachPictureUrlToReport(report: DBReport): Promise<DBReportWithPictureUrl> {
	let pictureUrl: DBReportWithPictureUrl['pictureUrl'] = null;

	if (report.pictureBucket && report.pictureKey) {
		pictureUrl = await getReportPictureUrl({
			pictureBucket: report.pictureBucket,
			pictureKey: report.pictureKey,
		});
	}

	return { ...report, pictureUrl };
}
