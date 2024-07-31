'use client';

import { useMemo, useState } from "react";

import { twMerge } from "tailwind-merge";

import { ReportDetailsContent } from "@/components/report-details-content";
import { Button, ButtonProps } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { DBReport } from "@/lib/api/reports.model";

const step = 10;

export function ReportsList({ allReports }: {
	allReports: DBReport[];
}) {
	const [currPage, setCurrPage] = useState(1);

	const lastPageNum = useMemo(() => Math.ceil(allReports.length / step), [allReports]);

	const currReports = useMemo(() => {
		const start = (currPage - 1) * step;
		const end = start + step;

		return allReports.slice(start, end);
	}, [allReports, currPage]);

	function changePageBy(amount: number) {
		setCurrPage(Math.max(Math.min(currPage + amount, lastPageNum), 1));
	}

	function goToPage(page: number) {
		setCurrPage(Math.max(Math.min(page, lastPageNum), 1));
	}

	return (
		<div className="w-full max-w-xl mx-auto px-3 py-6">
			<div className="w-full flex flex-col gap-3">
				{
					currReports.map((report) => (
						<div key={report.id} className="w-full p-4 border rounded-lg">
							<ReportDetailsContent report={report} shouldGetImage={true} acceptReportBtn deleteReportBtn />
						</div>
					))
				}
			</div>

			<Pagination className="mt-6">
				<PaginationContent>
					<div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 sm:gap-x-4">
						<PaginationItem>
							<PaginationPrevious className="cursor-pointer" onClick={() => changePageBy(-1)} />
						</PaginationItem>

						<div className="grid grid-cols-5 gap-x-2 items-center">
							{
								currPage > 1 && (
									<PaginationPageButton col={1} onClick={() => goToPage(1)} variant='outline'>
										1
									</PaginationPageButton>
								)
							}

							{
								currPage - 1 > 1 && (
									<PaginationPageButton col={2} onClick={() => goToPage(currPage - 1)} variant='outline'>
										{currPage - 1}
									</PaginationPageButton>
								)
							}

							<PaginationPageButton col={3} disabled>{currPage}</PaginationPageButton>

							{
								currPage + 1 < lastPageNum && (
									<PaginationPageButton col={4} onClick={() => goToPage(currPage + 1)} variant='outline'>
										{currPage + 1}
									</PaginationPageButton>
								)
							}

							{
								currPage < lastPageNum && (
									<PaginationPageButton col={5} onClick={() => goToPage(lastPageNum)} variant='outline'>
										{lastPageNum}
									</PaginationPageButton>
								)
							}
						</div>

						<PaginationItem>
							<PaginationNext className="cursor-pointer" onClick={() => changePageBy(1)} />
						</PaginationItem>
					</div>
				</PaginationContent>
			</Pagination>
		</div>
	);
}

function PaginationPageButton({ col, ...props }: ButtonProps & { col?: number; }) {
	return (
		<PaginationItem className={col ? `col-start-${col} col-span-1` : ''}> {/* col-start-1 col-start-2 col-start-3 col-start-4 col-start-5 */}
			<Button className="w-10 h-8" variant='outline' {...props}>{props.children}</Button>
		</PaginationItem>
	);
}