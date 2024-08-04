import { useEffect, useState, useTransition } from "react";

import { getClientRankings } from "@/lib/actions/rankings";
import { GetClientRankingsResponse } from "@/lib/api/rankings";
import { ClientRanking } from "@/lib/api/rankings.model";
import { emptyResponse } from "@/utils/api";

interface UseLeaderboardTopScoresOutput {
	topRankings: ClientRanking[];
	refetch: () => void;
	isPending: boolean;
}

export function useLeaderboardTopScores(): UseLeaderboardTopScoresOutput {
	const [isPending, startTransition] = useTransition();
	const [topRankingsRes, setTopRankingsRes] = useState<GetClientRankingsResponse>(emptyResponse);

	function refetch() {
		startTransition(async () => {
			const trRes = await getClientRankings();
			setTopRankingsRes(trRes);
		});
	}

	useEffect(() => {
		refetch();
	}, []);

	return {
		topRankings: topRankingsRes.data || [],
		isPending,
		refetch,
	};
}