'use client';

import { useMemo, useState } from "react";

import { ReportDetailsContent } from "@/components/report-details-content";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
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
		<div className="w-full max-w-xl mx-auto">
			<div className="w-full flex flex-col gap-3">
				{
					currReports.map((report) => (
						<div key={report.id} className="w-full p-4 border rounded-lg">
							<ReportDetailsContent report={report} shouldGetImage={true} />
						</div>
					))
				}
			</div>

			<Pagination className="my-6">
				<PaginationContent>
					<div className="grid grid-cols-[1fr_auto_1fr] gap-x-4">
						<PaginationItem>
							<PaginationPrevious onClick={() => changePageBy(-1)} />
						</PaginationItem>

						<div className="grid grid-cols-5 gap-x-2">
							{
								currPage > 1 && (
									<PaginationItem className="col-start-1 col-span-1">
										<Button onClick={() => goToPage(1)} variant='outline'>1</Button>
									</PaginationItem>
								)
							}

							{
								currPage - 1 > 1 && (
									<PaginationItem className="col-start-2 col-span-1">
										<Button onClick={() => goToPage(currPage - 1)} variant='outline'>{currPage - 1}</Button>
									</PaginationItem>
								)
							}

							<PaginationItem className="col-start-3 col-span-1">
								<Button variant='outline' disabled>{currPage}</Button>
							</PaginationItem>

							{
								currPage + 1 < lastPageNum && (
									<PaginationItem className="col-start-4 col-span-1">
										<Button onClick={() => goToPage(currPage + 1)} variant='outline'>{currPage + 1}</Button>
									</PaginationItem>
								)
							}

							{
								currPage < lastPageNum && (
									<PaginationItem className="col-start-5 col-span-1">
										<Button onClick={() => goToPage(lastPageNum)} variant='outline'>{lastPageNum}</Button>
									</PaginationItem>
								)
							}
						</div>

						<PaginationItem>
							<PaginationNext onClick={() => changePageBy(1)} />
						</PaginationItem>
					</div>
				</PaginationContent>
			</Pagination>
		</div>
	);
}