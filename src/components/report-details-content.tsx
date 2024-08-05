import { useMemo, useState, useTransition } from "react";

import { formatDate } from 'date-fns';
import { Check, Clock, LandPlot, MapPin, Trash, User, XIcon } from "lucide-react";

import { acceptReport as acceptReportApi, deleteReport as deleteReportApi, rejectReport as rejectReportApi } from "@/lib/api/reports";
import { ClientReport } from "@/lib/api/reports.model";
import { contactMethods } from "@/lib/utils";

import { Button } from "./ui/button";

export type ReportDetailsContentProps = {
	report: ClientReport;
	acceptReportBtn?: boolean;
	deleteReportBtn?: boolean;
	refreshReport?: (id: string) => void;
};

export function ReportDetailsContent({ report, acceptReportBtn, deleteReportBtn, refreshReport }: ReportDetailsContentProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isAcceptReportPending, startAcceptReportTransition] = useTransition();
	const [isDeletePostPending, startDeletePostTransition] = useTransition();

	const contactMethod = useMemo(() => {
		return contactMethods[report.contactMethod];
	}, [report.contactMethod]);

	const submittedAt = useMemo(() => {
		return formatDate(report.createdAt, 'dd/MM/yyyy HH:mm');
	}, [report.createdAt]);

	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	function acceptReport() {
		startAcceptReportTransition(() => {
			acceptReportApi(report.id).then(() => {
				refreshReport?.(report.id);
			});
		});
	}

	function rejectReport() {
		startAcceptReportTransition(() => {
			rejectReportApi(report.id).then(() => {
				refreshReport?.(report.id);
			});
		});
	}

	function deleteReport() {
		startDeletePostTransition(() => {
			deleteReportApi(report.id).then(() => {
				refreshReport?.(report.id);
			});
		});
	}

	return (
		<div className="flex flex-col gap-4 w-full h-full">
			{
				report.picture?.sizes.large && (
					<div className="w-full h-[clamp(300px,30dvh,450px)] bg-background-secondary border rounded-lg overflow-hidden">
						<img src={report.picture?.sizes.large} alt={report.description} className='w-full h-full object-contain' />
					</div>
				)
			}

			<p className={`text-lg ${isDescriptionExpanded === false ? 'line-clamp-3' : ''}`} onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
				{report.description}
			</p>

			<div className="relative grid grid-cols-[auto_1fr] place-items-center gap-x-2 gap-y-3">
				<LandPlot className='size-5' />
				<h3 className="w-full">Површина: {report.surfaceArea} м²</h3>
				<User className='size-5' />
				<h3 className="w-full">Пријавил: {report.contactFullName}</h3>
				<contactMethod.icon className='size-5' />
				<h3 className="w-full">Контакт: {report.contactInfo} ({contactMethod.label})</h3>
				<MapPin className='size-5' />
				<h3 className="w-full">Адреса: {report.address}</h3>
				<Clock className='size-5' />
				<h3 className="w-full">Пријавено на: {submittedAt}</h3>
				{
					report.isAccepted === true && (
						<div className=" bg-green-400/20 text-green-400 rounded-lg w-fit px-3 py-1 grid grid-cols-subgrid col-span-full place-items-center">
							<Check className='size-5' />
							<h3 className="w-full">Пријавата е прегледана и прифатена</h3>
						</div>
					)
				}
			</div>

			{
				(acceptReportBtn || deleteReportBtn) && isDeleteDialogOpen === false && (
					<div className="grid grid-cols-2 gap-x-2">
						{
							acceptReportBtn && (
								<Button className="col-start-1 col-span-1" onClick={report.isAccepted ? rejectReport : acceptReport} variant={report.isAccepted ? 'destructive' : 'default'} disabled={isAcceptReportPending}>
									{
										report.isAccepted ? (
											<>
												<XIcon className="size-6 mr-2" /> Одбиј
											</>
										) : (
											<>
												<Check className="size-6 mr-2" /> Прифати
											</>
										)
									}
								</Button>
							)
						}

						{
							deleteReportBtn && (
								<Button
									variant='destructive'
									className="col-start-2 col-span-1"
									onClick={() => setIsDeleteDialogOpen(true)}
									disabled={isDeletePostPending}>
									<Trash className="size-6 mr-2" /> Избриши
								</Button>
							)
						}

					</div>
				)
			}

			{
				isDeleteDialogOpen && (
					<div className="col-start-2 col-span-1 w-[27ch] text-center mx-auto">
						<h3 className="mb-2">Дали сте сигурни дека сакате да ја избришете пријавата?</h3>
						<div className="grid grid-cols-2 gap-x-2 w-[20ch] mx-auto">
							<Button variant='destructive' onClick={deleteReport} disabled={isDeletePostPending}>
								<Trash className="size-4 mr-2" />
								Да
							</Button>
							<Button variant='secondary' onClick={() => setIsDeleteDialogOpen(false)}>
								<XIcon className="size-4 mr-2" />
								Не
							</Button>
						</div>
					</div>
				)
			}

		</div>
	);
}