import { PropsWithChildren } from "react";

export default function LeaderboardLayout({ children }: PropsWithChildren<{}>) {
	return (
		<div className="px-4 sm:px-6 py-12 container max-w-sm text-center flex flex-col items-center justify-center gap-y-6">
			{children}
		</div>
	);
}