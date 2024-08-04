'use server';

import { auth, clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

import { ApiResponse, createErrorResponse, createResponse } from "@/utils/api";

import prisma from "../api/db";
import { DEFAULT_LIMIT, ERROR_MESSAGE, GetClientRankingsResponse, getTopTotalSurfaceAreas } from "../api/rankings";
import { ClientRanking } from "../api/rankings.model";
import { logger } from "../logger";

export async function getClientRankings(limit: number = DEFAULT_LIMIT): Promise<GetClientRankingsResponse> {
	try {
		console.log('getClientRankings');

		const { data: topTotalSurfaceAreas, success } = await getTopTotalSurfaceAreas(limit);
		if (!success) {
			return createErrorResponse(ERROR_MESSAGE);
		}

		const userIdList = topTotalSurfaceAreas.map(area => area.userId);
		const { data: users } = await clerkClient.users.getUserList({ userId: userIdList, limit });

		const rankedData = topTotalSurfaceAreas
			.sort((a, b) => b.totalSurfaceArea - a.totalSurfaceArea)
			.reduce<ClientRanking[]>((acc, user, index, arr) => {
				const previousRanking = arr[index - 1];
				const rank = previousRanking && previousRanking.totalSurfaceArea === user.totalSurfaceArea
					? acc[acc.length - 1].rank
					: index + 1;
				const userDetails = users.find(u => u.id === user.userId);
				acc.push({
					...user,
					userName: userDetails?.fullName ?? null,
					rank
				});
				return acc;
			}, []);

		return createResponse(rankedData);
	} catch (error) {
		logger.error('Error fetching leaderboard', { error });
		return createErrorResponse(ERROR_MESSAGE);
	}
}

export type GetUserRankingResponse = ApiResponse<Prisma.UserTotalSurfaceAreaGetPayload<{}>>;

export async function getUserRanking(): Promise<GetUserRankingResponse> {
	try {
		const { userId } = auth();
		if (!userId) {
			return createErrorResponse(ERROR_MESSAGE);
		}

		const userRanking = await prisma.userTotalSurfaceArea.findUnique({
			where: { userId }
		});

		return userRanking
			? createResponse(userRanking)
			: createErrorResponse(ERROR_MESSAGE);
	} catch (error) {
		logger.error('Error fetching user ranking', { error });
		return createErrorResponse(ERROR_MESSAGE);
	}
}

export type UpdateUserRankingResponse = ApiResponse<Prisma.UserTotalSurfaceAreaGetPayload<{}>>;

export async function updateUserRanking({ isPrivate }: { isPrivate: boolean }): Promise<UpdateUserRankingResponse> {
	try {
		const { userId } = auth();

		if (!userId) {
			return createErrorResponse('Неуспешно ажурирање на ранг листата.');
		}

		const updatedUserRanking = await prisma.userTotalSurfaceArea.update({
			where: { userId },
			data: { isPrivate }
		});

		return updatedUserRanking
			? createResponse(updatedUserRanking)
			: createErrorResponse('Неуспешно ажурирање на ранг листата.');
	} catch (error) {
		logger.error('Error updating user ranking', { error });
		return createErrorResponse('Неуспешно ажурирање на ранг листата.');
	}
}