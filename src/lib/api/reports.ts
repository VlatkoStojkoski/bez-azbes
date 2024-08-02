'use server';

import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

import prisma from "@/lib/api/db";
import { ClientReport, NewReport } from "@/lib/api/reports.model";
import { AuthorizationError, DatabaseError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { ApiResponse, createErrorResponse, createResponse } from "@/utils/api";

import apiConfig from "./config";
import { getClientPicture, insertPicture } from "./pictures";
import { ClientPicture, ClientPictureData } from "./pictures.model";
import { saveImageSizes } from "../images";

/**
 * Creates a new report
 * @param reportData The data for the new report
 * @returns An ApiResponse containing the created ClientReport
 */
export async function createReport(reportData: NewReport): Promise<ApiResponse<ClientReport>> {
	const { userId } = auth();

	if (!userId) {
		throw new AuthorizationError('User not authenticated');
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
		throw new DatabaseError('Failed to create report');
	}
}

/**
 * Fetches a specific report
 * @param reportId The ID of the report to fetch
 * @returns An ApiResponse containing the fetched ClientReport
 */
export async function getReport(reportId: string): Promise<ApiResponse<ClientReport>> {
	try {
		const report = await prisma.report.findUnique({
			where: { id: reportId },
			include: { picture: true }
		});

		if (!report) {
			throw new ValidationError('Report not found');
		}

		const clientReport = await getClientReport(report);
		return createResponse(clientReport);
	} catch (error) {
		logger.error('Error fetching report', { error, reportId });
		throw new DatabaseError('Failed to fetch report');
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

/**
 * Fetches multiple reports based on provided configuration
 * @param config The configuration for fetching reports
 * @returns An ApiResponse containing an array of ClientReports
 */
export async function getReports(config: GetReportsConfig): Promise<ApiResponse<{ reports: ClientReport[], nextCursor: string | null }>> {
	const { userId, sessionClaims } = auth();
	if (!userId) {
		throw new AuthorizationError('User not authenticated');
	}

	const { paginate, sort = 'newest', onlyUserReports = false } = config;
	const take = paginate?.take || apiConfig.defaultPageSize;

	if (!onlyUserReports && sessionClaims.role !== 'admin') {
		throw new AuthorizationError('User not authorized to access all reports');
	}

	try {
		const reports = await prisma.report.findMany({
			...(
				paginate ? {
					take: take + 1,
					cursor: paginate?.cursor ? { id: paginate.cursor } : undefined,
				} : {}
			),
			orderBy: {
				createdAt: sort === 'newest' ? 'desc' : 'asc',
			},
			include: {
				picture: true,
			},
			where: onlyUserReports ? {
				submittedBy: {
					equals: userId
				}
			} : undefined
		});

		const hasNextPage = reports.length > take;
		const nextCursor = hasNextPage ? (reports.pop()?.id ?? null) : null;

		const clientReports = await Promise.all(reports.map(getClientReport));
		return createResponse({ reports: clientReports, nextCursor });
	} catch (error) {
		logger.error('Error fetching reports', { error, userId });
		throw new DatabaseError('Failed to fetch reports');
	}
}

/**
 * Updates scalar fields of a report
 * @param reportId The ID of the report to update
 * @param data The data to update
 * @returns An ApiResponse containing the updated ClientReport
 */
export async function updateReportScalar(reportId: string, data: Prisma.ReportUpdateInput): Promise<ApiResponse<ClientReport>> {
	const { userId } = auth();
	if (!userId) {
		throw new AuthorizationError('User not authenticated');
	}

	try {
		const updatedReport = await prisma.report.update({
			where: { id: reportId },
			data,
			include: { picture: true }
		});

		const clientReport = await getClientReport(updatedReport);
		return createResponse(clientReport);
	} catch (error) {
		logger.error('Error updating report', { error, reportId, userId });
		throw new DatabaseError('Failed to update report');
	}
}

/**
 * Accepts a report
 * @param reportId The ID of the report to accept
 * @returns An ApiResponse containing the updated ClientReport
 */
export async function acceptReport(reportId: string): Promise<ApiResponse<ClientReport>> {
	return updateReportScalar(reportId, { isAccepted: true });
}

/**
 * Rejects a report
 * @param reportId The ID of the report to reject
 * @returns An ApiResponse containing the updated ClientReport
 */
export async function rejectReport(reportId: string): Promise<ApiResponse<ClientReport>> {
	return updateReportScalar(reportId, { isAccepted: false });
}

/**
 * Deletes a report
 * @param reportId The ID of the report to delete
 * @returns An ApiResponse containing the updated ClientReport
 */
export async function deleteReport(reportId: string): Promise<ApiResponse<ClientReport>> {
	return updateReportScalar(reportId, { isDeleted: true });
}

/**
 * Converts a database Report object to a ClientReport
 * @param report The database Report object
 * @returns A ClientReport object
 */
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