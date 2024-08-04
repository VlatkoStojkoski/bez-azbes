'use client';

import { useAuth } from "@clerk/nextjs";

import { LeaderboardTopScores } from "./leaderboard-top-scores";
import { LeaderboardUserRanking } from "./leaderboard-user-ranking";
import { useLeaderboard } from "./use-leaderboard";

export function Leaderboard() {
	const { userId } = useAuth();

	const { rankings, userRanking } = useLeaderboard();

	return (
		<>
			<LeaderboardTopScores
				topRankings={rankings.data}
				userId={userId}
				isPending={rankings.isPending} />
			<LeaderboardUserRanking
				userRanking={userRanking.data}
				updateUserRanking={userRanking.updateUserRanking}
				isPending={userRanking.isPending} />
		</>
	);
}
