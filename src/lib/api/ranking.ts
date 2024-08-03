import { clerkClient } from "@clerk/nextjs/server";
import { UserTotalSurfaceArea } from "@prisma/client";

import { ApiResponse, createErrorResponse, createResponse } from "@/utils/api";

import prisma from "./db";
import { ClientRanking } from "./ranking.model";
import { logger } from "../logger";

export async function getTopTotalSurfaceAreas({ limit = 10 }: { limit?: number }): Promise<ApiResponse<UserTotalSurfaceArea[]>> {
	try {
		const sortedSurfaceAreas = await prisma.userTotalSurfaceArea.findMany({
			orderBy: {
				totalSurfaceArea: 'desc'
			},
			take: limit,
		});

		return createResponse(sortedSurfaceAreas);
	} catch (error) {
		logger.error('Error fetching leaderboard', { error });

		return createErrorResponse('Неуспешно вчитување на ранг листата.');
	}
}

export async function getClientRankings({ limit = 10 }: { limit?: number }): Promise<ApiResponse<ClientRanking[]>> {
	try {
		const topTotalSurfaceAreas = await getTopTotalSurfaceAreas({ limit: 10 });

		if (topTotalSurfaceAreas.success !== true) {
			return topTotalSurfaceAreas;
		}

		const userIdList = topTotalSurfaceAreas.data.map(userTotalSurfaceArea => userTotalSurfaceArea.userId);

		logger.log('User ID List', { userIdList });

		const users = await clerkClient.users.getUserList({ userId: userIdList, limit });

		logger.log('Users', { users });

		const rankings = topTotalSurfaceAreas.data.map(userTotalSurfaceArea => {
			const user = users.data.find(user => user.id === userTotalSurfaceArea.userId);

			return {
				...userTotalSurfaceArea,
				user: user ?? null
			};
		});

		return createResponse(rankings);
	} catch (error) {
		logger.error('Error fetching leaderboard', { error });

		return createErrorResponse('Неуспешно вчитување на ранг листата.');
	}
}