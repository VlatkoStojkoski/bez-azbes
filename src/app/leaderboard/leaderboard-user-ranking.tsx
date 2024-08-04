'use client';
import { Check, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useLeaderboardUserRanking } from "./use-leaderboard-user-ranking";

export function LeaderboardUserRanking({ refetchTopRankings }: { refetchTopRankings: () => void }) {
	const {
		userRanking,
		updateUserRanking,
		isPending
	} = useLeaderboardUserRanking();

	const handleUpdateUserRanking = (isPrivate: boolean) => function () {
		updateUserRanking(isPrivate);
		refetchTopRankings();
	};

	return userRanking && (
		<div className="col-span-full grid grid-cols-2 gap-y-2 gap-x-3 place-items-center mt-6">
			<p className="col-span-full text-sm max-w-[30ch]">Дали сакате вашите пријави да се појавуваат на ранг листата?</p>
			<Button
				size='sm'
				className="ml-auto px-4"
				disabled={userRanking.isPrivate === false || isPending}
				onClick={handleUpdateUserRanking(false)}>
				<Check className="size-[1.25em] mr-1" />Да
			</Button>
			<Button
				size='sm'
				variant='destructive' className="mr-auto px-4"
				disabled={userRanking.isPrivate === true || isPending}
				onClick={handleUpdateUserRanking(true)}>
				<XIcon className="size-[1.25em] mr-1" />Не
			</Button>
		</div >
	);
}