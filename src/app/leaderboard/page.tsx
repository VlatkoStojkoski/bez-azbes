import { Suspense } from "react";

import { Medal } from "lucide-react";

import { LeaderboardList, RankingsSkeleton } from "./leaderboard-list";

export default async function LeaderboardPage() {
	return (
		<>
			<h1 className="text-2xl sm:text-3xl text-center flex flex-row gap-x-2 items-center font-bold mb-2">
				<Medal className="size-7" /> Ранг Листа
			</h1>

			<div className="w-full grid grid-cols-[8ch_auto_8ch] gap-y-3">
				<div className="w-full col-span-full grid grid-cols-3 place-items-center items-center justify-center text-xs px-3">
					<span className="w-full text-left">Бр.</span>
					<span className="w-full text-center">Име</span>
					<span className="w-full text-right">Површина (м²)</span>
				</div>
				<LeaderboardList />
			</div>
		</>
	);
}
