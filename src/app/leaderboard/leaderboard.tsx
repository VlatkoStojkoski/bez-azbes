'use client';

import { LeaderboardTopScores } from "./leaderboard-top-scores";
import { LeaderboardUserRanking } from "./leaderboard-user-ranking";
import { useLeaderboardTopScores } from "./use-leaderboard-top-scores";
import { useLeaderboardUserRanking } from "./use-leaderboard-user-ranking";

export function Leaderboard() {
	const userRankingData = useLeaderboardUserRanking();
	const topScoresData = useLeaderboardTopScores();

	console.log('Leaderboard - userRankingData:', userRankingData);
	console.log('Leaderboard - topScoresData:', topScoresData);

	return (
		<>
			<LeaderboardTopScores {...topScoresData} />
			<LeaderboardUserRanking refetchTopRankings={topScoresData.refetch} {...userRankingData} />
		</>
	);
}
