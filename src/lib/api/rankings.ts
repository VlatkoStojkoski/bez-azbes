import { UserTotalSurfaceArea } from "@prisma/client";

import { ApiResponse, createErrorResponse, createResponse } from "@/utils/api";

import prisma from "./db";
import { ClientRanking } from "./rankings.model";
import { logger } from "../logger";

export const DEFAULT_LIMIT = 10;
export const ERROR_MESSAGE = 'Неуспешно вчитување на ранг листата.';

export async function getTopTotalSurfaceAreas(limit: number = DEFAULT_LIMIT): Promise<ApiResponse<UserTotalSurfaceArea[]>> {
	try {
		const sortedSurfaceAreas = await prisma.userTotalSurfaceArea.findMany({
			orderBy: { totalSurfaceArea: 'desc' },
			where: { isPrivate: false },
			take: limit,
		});
		console.log(sortedSurfaceAreas);
		return createResponse(sortedSurfaceAreas);
	} catch (error) {
		logger.error('Error fetching leaderboard', { error });
		return createErrorResponse(ERROR_MESSAGE);
	}
}

export type GetClientRankingsResponse = ApiResponse<ClientRanking[]>;