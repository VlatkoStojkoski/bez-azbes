'use client';

import { LeaderboardTopScores } from "./leaderboard-top-scores";
import { LeaderboardUserRanking } from "./leaderboard-user-ranking";
import { useLeaderboard } from "./use-leaderboard";

export function Leaderboard() {
	const { rankings, userRanking } = useLeaderboard();

	return (
		<>
			<LeaderboardTopScores topRankings={rankings.data} />
			<LeaderboardUserRanking userRanking={userRanking.data} isPending={userRanking.isPending} updateUserRanking={userRanking.updateUserRanking} />
		</>
	);
}
