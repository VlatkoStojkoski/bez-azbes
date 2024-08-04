import { Medal } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { getClientRankings } from "@/lib/api/ranking";

export default async function LeaderboardPage() {
	const rankings = await getClientRankings({ limit: 10 });

	if (rankings.success !== true) {
		return (
			<div>
				<h2>Грешка при вчитување на ранг листата</h2>
			</div>
		);
	}

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
				{
					rankings.data.map((ranking, idx) => (
						<Ranking key={ranking.userId} index={idx} name={ranking.user?.fullName ?? "Анонимен"} score={ranking.totalSurfaceArea} />
					))
				}
			</div>
		</>
	);
}

function Ranking({ index, name, score }: { index: number; name: string; score: number }) {
	return (
		<div
			className={twMerge(
				"w-full border shadow-lg rounded-lg col-span-full grid grid-cols-subgrid place-items-center items-center justify-center",
				index < 3 ? "py-3" : "",
			)}
		>
			<span className={`
				p-3 size-[4ch] rounded-full leading-none bg-gradient-to-r
				${index < 3 ? "font-bold text-center" : ""}
				${index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : ''}
				${index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-600" : ''}
				${index === 2 ? "bg-gradient-to-br from-yellow-700 to-yellow-900" : ''}
			`}>{index + 1}.</span>
			<span className="p-3 break-words text-center">{name}</span>
			<span className="p-3 max-w-full break-words">{score}</span>
		</div>
	);
}
