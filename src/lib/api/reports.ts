'use server';

import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

import prisma from "@/lib/api/db";
import { ClientReport, NewReport } from "@/lib/api/reports.model";
import { logger } from "@/lib/logger";
import { ApiResponse, createErrorResponse, createResponse } from "@/utils/api";

import apiConfig from "./config";
import { getClientPicture, insertPicture } from "./pictures";
import { ClientPicture, ClientPictureData } from "./pictures.model";
import { saveImageSizes } from "../images";

export async function createReport(reportData: NewReport): Promise<ApiResponse<ClientReport>> {
	const { userId } = auth();

	if (!userId) {
		return createErrorResponse('User not authenticated');
	}

	const reportId = uuidv4();

	try {
		let pictureData: ClientPictureData | null = null;
		if (reportData.picture?.[0]) {
			const image = await reportData.picture[0].arrayBuffer();
			const pictureId = uuidv4();
			pictureData = await saveImageSizes(image, pictureId);
		}

		const newReportData: Prisma.ReportCreateInput = {
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

		const newReportRes = await prisma.report.create({ data: newReportData });

		let pictureRes: ClientPicture | null = null;
		if (pictureData) {
			pictureRes = await insertPicture(pictureData, reportId);
		}

		const clientReport: ClientReport = {
			...newReportRes,
			picture: pictureRes,
		};

		return createResponse(clientReport);
	} catch (error) {
		logger.error('Error creating report', { error, userId });
		return createErrorResponse('Failed to create report');
	}
}

export async function getReport(reportId: string): Promise<ApiResponse<ClientReport>> {
	try {
		const report = await prisma.report.findUnique({
			where: { id: reportId, isDeleted: false },
			include: { picture: true }
		});

		if (!report) {
			return createErrorResponse('Report not found');
		}

		const clientReport = await getClientReport(report);
		return createResponse(clientReport);
	} catch (error) {
		logger.error('Error fetching report', { error, reportId });
		return createErrorResponse('Failed to fetch report');
	}
}

interface GetReportsConfig {
	paginate?: {
		cursor?: string;
		take?: number;
	};
	sort?: 'oldest' | 'newest';
	onlyUserReports?: boolean;
}

export async function getReports(config: GetReportsConfig): Promise<ApiResponse<{ reports: ClientReport[], nextCursor: string | null }>> {
	const { userId, sessionClaims } = auth();

	if (!userId) {
		return createErrorResponse('User not authenticated');
	}

	const { paginate, sort = 'newest', onlyUserReports = false } = config;
	const take = paginate?.take || apiConfig.defaultPageSize;

	if (!onlyUserReports && sessionClaims.metadata.role !== 'admin') {
		return createErrorResponse('User not authorized to access all reports');
	}

	try {
		const reports = await prisma.report.findMany({
			...(paginate ? {
				take: take + 1,
				cursor: paginate?.cursor ? { id: paginate.cursor } : undefined,
			} : {}),
			orderBy: {
				createdAt: sort === 'newest' ? 'desc' : 'asc',
			},
			include: {
				picture: true,
			},
			where: {
				isDeleted: false,
				submittedBy: onlyUserReports ? { equals: userId } : undefined
			}
		});

		const hasNextPage = reports.length > take;
		const nextCursor = hasNextPage ? (reports.pop()?.id ?? null) : null;

		const clientReports = await Promise.all(reports.map(getClientReport));
		return createResponse({ reports: clientReports, nextCursor });
	} catch (error) {
		logger.error('Error fetching reports', { error, userId });
		return createErrorResponse('Failed to fetch reports');
	}
}

export async function updateReportScalar(reportId: string, data: Prisma.ReportUpdateInput): Promise<ApiResponse<ClientReport>> {
	const { userId } = auth();
	if (!userId) {
		return createErrorResponse('User not authenticated');
	}

	try {
		const updatedReport = await prisma.report.update({
			where: { id: reportId, isDeleted: false },
			data,
			include: { picture: true }
		});

		const clientReport = await getClientReport(updatedReport);
		return createResponse(clientReport);
	} catch (error) {
		logger.error('Error updating report', { error, reportId, userId });
		return createErrorResponse('Failed to update report');
	}
}

export async function acceptReport(reportId: string): Promise<ApiResponse<ClientReport>> {
	return updateReportScalar(reportId, { isAccepted: true });
}

export async function rejectReport(reportId: string): Promise<ApiResponse<ClientReport>> {
	return updateReportScalar(reportId, { isAccepted: false });
}

export async function deleteReport(reportId: string): Promise<ApiResponse<ClientReport>> {
	return updateReportScalar(reportId, { isDeleted: true });
}

export async function getClientReport(report: Prisma.ReportGetPayload<{ include: { picture: true } }>): Promise<ClientReport> {
	try {
		const picture = report.picture ? await getClientPicture(report.picture) : null;

		return {
			...report,
			picture,
		};
	} catch (error) {
		logger.error('Error generating client report', { error, report });

		return {
			...report,
			picture: null,
		};
	}
}
