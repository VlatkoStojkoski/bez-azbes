import { PropsWithChildren } from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function DashboardLayout({
	children
}: PropsWithChildren<{}>) {
	const { sessionClaims } = auth();

	if (sessionClaims?.metadata.role !== "admin") {
		return redirect(`/?error=${encodeURIComponent("Не сте авторизирани.")}`);
	}

	return (
		<div className="flex justify-center w-full h-full py-12">
			{children}
		</div>
	);
}