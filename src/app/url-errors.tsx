'use client';

import { useEffect } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function UrlErrors() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	useEffect(() => {
		const currUrlSearchParams = new URLSearchParams(Array.from(searchParams.entries()));

		const error = currUrlSearchParams.get("error");
		if (error) {
			toast.error(error, { duration: 5000 });
		}

		currUrlSearchParams.delete("error");

		const search = currUrlSearchParams.toString();
		const searchQuery = search ? `?${search}` : "";

		router.replace(`${pathname}${searchQuery}`);
	}, [searchParams]);

	return (<></>);
}