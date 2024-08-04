'use client';

import { twMerge } from "tailwind-merge";

import { ClientRanking } from "@/lib/api/rankings.model";

export function LeaderboardTopScores({ topRankings }: { topRankings: ClientRanking[]; }) {
	return (
		<>
			{
				topRankings && topRankings.map((ranking, idx) => (
					<Ranking key={ranking.userId} rank={ranking.rank} name={ranking.userName ?? "Анонимен"} score={ranking.totalSurfaceArea} isHighlighted={ranking.userId === 'user1'} />
				))
			}
		</>
	);
}

function Ranking({ rank, name, score, isHighlighted }: { rank: number; name: string; score: number; isHighlighted: boolean; }) {
	return (
		<div
			className={twMerge(
				"w-full bg-background border shadow-lg rounded-lg col-span-full grid grid-cols-subgrid place-items-center items-center justify-center",
				rank < 3 ? "py-3" : "",
				isHighlighted ? "drop-shadow-glow -z-10 bg-primary-900" : ""
			)}
		>
			<span className={`
                p-3 size-[4ch] rounded-full leading-none bg-gradient-to-r
                ${rank < 3 ? "font-bold text-center" : ""}
                ${rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : ''}
                ${rank === 2 ? "bg-gradient-to-br from-gray-400 to-gray-600" : ''}
                ${rank === 3 ? "bg-gradient-to-br from-yellow-700 to-yellow-900" : ''}
            `}>{rank}.</span>
			<span className="p-3 break-words text-center">{name}</span>
			<span className="p-3 max-w-full break-words">{score}</span>
		</div>
	);
}
