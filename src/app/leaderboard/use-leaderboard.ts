import { useEffect, useState } from "react";

import { Prisma } from "@prisma/client";

import { GetUserRankingResponse, updateUserRanking as apiUpdateUserRanking, getClientRankings, getUserRanking } from "@/lib/actions/rankings";
import { GetClientRankingsResponse } from "@/lib/api/rankings";
import { ClientRanking } from "@/lib/api/rankings.model";
import { emptyResponse } from "@/utils/api";

export interface UseLeaderboardOutput {
	userRanking: {
		data: Prisma.UserTotalSurfaceAreaGetPayload<{}> | null;
		refetch: () => void;
		isPending: boolean;
		updateUserRanking: (isPrivate: boolean) => void;
	};
	rankings: {
		data: ClientRanking[];
		refetch: () => void;
		isPending: boolean;
	}
}

export function useLeaderboard(): UseLeaderboardOutput {
	const [isTopRankingsPending, setIsTopRankingsPending] = useState(false);
	const [topRankingsRes, setTopRankingsRes] = useState<GetClientRankingsResponse>(emptyResponse);

	const [isUserRankingPending, setIsUserRankingPending] = useState(false);
	const [userRankingRes, setUserRankingRes] = useState<GetUserRankingResponse>(emptyResponse);

	async function refetchTopRankings() {
		setIsTopRankingsPending(true);
		const trRes = await getClientRankings();
		setTopRankingsRes(trRes);
		setIsTopRankingsPending(false);
	}

	async function refetchUserRanking() {
		setIsUserRankingPending(true);
		const urRes = await getUserRanking();
		setUserRankingRes(urRes);
		setIsUserRankingPending(false);
	}

	useEffect(() => {
		(async () => {
			await refetchTopRankings();
			await refetchUserRanking();
		})();
	}, []);

	async function updateUserRanking(isPrivate: boolean) {
		setIsUserRankingPending(true);
		const urRes = await apiUpdateUserRanking({ isPrivate });
		setUserRankingRes(urRes);
		setIsUserRankingPending(false);
		await refetchTopRankings();
	}

	return {
		rankings: {
			data: topRankingsRes.data || [],
			isPending: isTopRankingsPending,
			refetch: refetchTopRankings,
		},
		userRanking: {
			data: userRankingRes.data,
			isPending: isUserRankingPending,
			refetch: refetchUserRanking,
			updateUserRanking,
		},
	};
}