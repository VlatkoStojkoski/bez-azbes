import { clerkClient } from "@clerk/nextjs/server";
import { Prisma, UserTotalSurfaceArea } from "@prisma/client";

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
		const topTotalSurfaceAreasRes = await getTopTotalSurfaceAreas({ limit: 10 });
		const { data: topTotalSurfaceAreas, error, success } = topTotalSurfaceAreasRes;

		if (success !== true) {
			return topTotalSurfaceAreasRes;
		}

		const userIdList = topTotalSurfaceAreas.map(userTotalSurfaceArea => userTotalSurfaceArea.userId);

		const { data: users } = await clerkClient.users.getUserList({ userId: userIdList, limit });

		const unrankedData = topTotalSurfaceAreas.sort(() => Math.random() - 0.5).sort((a, b) => b.totalSurfaceArea - a.totalSurfaceArea);

		const rankedData = unrankedData.reduce<ClientRanking[]>((acc, user, index, arr) => {
			const previousRanking = arr[index - 1];
			const rank = previousRanking && previousRanking.totalSurfaceArea === user.totalSurfaceArea
				? acc[acc.length - 1].rank
				: index + 1;

			const userDetails = users.find(u => u.id === user.userId);

			acc.push({
				...user,
				user: userDetails ?? null,
				rank
			});

			return acc;
		}, []);

		return createResponse(rankedData);
	} catch (error) {
		logger.error('Error fetching leaderboard', { error });

		return createErrorResponse('Неуспешно вчитување на ранг листата.');
	}
}