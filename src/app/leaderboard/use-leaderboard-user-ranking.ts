import { useEffect, useState, useTransition } from "react";

import { Prisma } from "@prisma/client";

import { GetUserRankingResponse, updateUserRanking as apiUpdateUserRanking, getUserRanking } from "@/lib/actions/rankings";
import { GetClientRankingsResponse } from "@/lib/api/rankings";
import { emptyResponse } from "@/utils/api";

interface UseLeaderboardUserRankingOutput {
	userRanking: Prisma.UserTotalSurfaceAreaGetPayload<{}> | null;
	refetch: () => void;
	isPending: boolean;
	updateUserRanking: (isPrivate: boolean) => void;
}

export function useLeaderboardUserRanking(): UseLeaderboardUserRankingOutput {
	const [isPending, startTransition] = useTransition();
	const [userRankingRes, setUserRankingRes] = useState<GetUserRankingResponse>(emptyResponse);

	function refetch() {
		startTransition(async () => {
			const urRes = await getUserRanking();
			setUserRankingRes(urRes);
		});
	}

	useEffect(() => {
		refetch();
	}, []);

	function updateUserRanking(isPrivate: boolean) {
		startTransition(async () => {
			const urRes = await apiUpdateUserRanking({ isPrivate });
			setUserRankingRes(urRes);
		});
	}

	return {
		userRanking: userRankingRes.data,
		updateUserRanking,
		isPending,
		refetch,
	};
}