import { useEffect, useState } from "react";

import { getClientRankings } from "@/lib/actions/rankings";
import { GetClientRankingsResponse } from "@/lib/api/rankings";
import { ClientRanking } from "@/lib/api/rankings.model";
import { emptyResponse } from "@/utils/api";

export interface UseLeaderboardTopScoresOutput {
	topRankings: ClientRanking[];
	refetch: () => void;
	isPending: boolean;
}

export function useLeaderboardTopScores(): UseLeaderboardTopScoresOutput {
	const [isPending, setIsPending] = useState(false);
	const [topRankingsRes, setTopRankingsRes] = useState<GetClientRankingsResponse>(emptyResponse);

	async function refetch() {
		console.log('useLeaderboardTopScores - refetching');
		setIsPending(true);
		const trRes = await getClientRankings();
		console.log('useLeaderboardTopScores - trRes', trRes);
		setTopRankingsRes(trRes);
		setIsPending(false);
	}

	return {
		topRankings: topRankingsRes.data || [],
		isPending,
		refetch,
	};
}
