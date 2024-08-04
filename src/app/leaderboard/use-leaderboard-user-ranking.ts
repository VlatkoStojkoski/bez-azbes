import { useEffect, useState } from "react";

import { Prisma } from "@prisma/client";

import { GetUserRankingResponse, updateUserRanking as apiUpdateUserRanking, getUserRanking } from "@/lib/actions/rankings";
import { GetClientRankingsResponse } from "@/lib/api/rankings";
import { emptyResponse } from "@/utils/api";

export interface UseLeaderboardUserRankingOutput {
	userRanking: Prisma.UserTotalSurfaceAreaGetPayload<{}> | null;
	refetch: () => void;
	isPending: boolean;
	updateUserRanking: (isPrivate: boolean) => void;
}

export function useLeaderboardUserRanking(): UseLeaderboardUserRankingOutput {
	const [isPending, setIsPending] = useState(false);
	const [userRankingRes, setUserRankingRes] = useState<GetUserRankingResponse>(emptyResponse);

	async function refetch() {
		console.log('useLeaderboardUserRanking - refetching');
		setIsPending(true);
		const urRes = await getUserRanking();
		console.log('useLeaderboardUserRanking - urRes', urRes);
		setUserRankingRes(urRes);
		setIsPending(false);
	}

	useEffect(() => {
		refetch();
	}, []);

	async function updateUserRanking(isPrivate: boolean) {
		setIsPending(true);
		const urRes = await apiUpdateUserRanking({ isPrivate });
		setUserRankingRes(urRes);
		setIsPending(false);
	}

	return {
		userRanking: userRankingRes.data,
		updateUserRanking,
		isPending,
		refetch,
	};
}
