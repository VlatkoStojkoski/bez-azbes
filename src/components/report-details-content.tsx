import { useEffect, useMemo, useState, useTransition } from "react";

import { formatDate } from 'date-fns';
import { Check, Clock, Cross, Crosshair, MapPin, Trash, User, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { acceptReport as acceptReportApi, deleteReport as deleteReportApi, getReportPictureUrl, rejectReport as rejectReportApi } from "@/lib/api/reports";
import { DBReport } from "@/lib/api/reports.model";
import { contactMethods } from "@/lib/utils";

import { Button } from "./ui/button";

export function ReportDetailsContent({ report, shouldGetImage, acceptReportBtn, deleteReportBtn }: {
	report: DBReport;
	shouldGetImage?: boolean;
	acceptReportBtn?: boolean;
	deleteReportBtn?: boolean;
}) {
	const router = useRouter();

	const [isAcceptReportPending, startAcceptReportTransition] = useTransition();
	const [isDeletePostPending, startDeletePostTransition] = useTransition();

	const contactMethod = useMemo(() => {
		return contactMethods[report.contactMethod];
	}, [report.contactMethod]);

	const submittedAt = useMemo(() => {
		console.log(report.createdAt);
		return formatDate(report.createdAt, 'dd/MM/yyyy HH:mm');
	}, [report.createdAt]);

	const [pictureSrc, setPictureSrc] = useState<string | null>(null);
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	useEffect(() => {
		if ((shouldGetImage ?? true) === false || report.pictureBucket === null || report.pictureKey === null) {
			return;
		}

		getReportPictureUrl({
			pictureBucket: report.pictureBucket,
			pictureKey: report.pictureKey,
		}).then((pictureUrl) => {
			setPictureSrc(pictureUrl);
		});
	}, [report.pictureBucket, report.pictureKey, shouldGetImage, report]);

	function acceptReport() {
		startAcceptReportTransition(() => {
			acceptReportApi(report.id).then(() => {
				router.refresh();
			});
		});
	}

	function rejectReport() {
		startAcceptReportTransition(() => {
			rejectReportApi(report.id).then(() => {
				router.refresh();
			});
		});
	}

	function deleteReport() {
		startDeletePostTransition(() => {
			deleteReportApi(report.id).then(() => {
				router.refresh();
			});
		});
	}

	return (
		<div className="flex flex-col gap-4 w-full h-full">
			{
				pictureSrc !== null && (
					<div className="w-full h-[clamp(300px,30dvh,450px)] bg-background-secondary border rounded-lg overflow-hidden">
						<img src={pictureSrc} alt={report.description} className='w-full h-full object-contain' />
					</div>
				)
			}

			<p className={`text-lg ${isDescriptionExpanded === false ? 'line-clamp-3' : ''}`} onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
				{report.description}
			</p>

			<div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-4">
				<User className='size-6' />
				<h3>Пријавил: {report.contactFullName}</h3>
				<contactMethod.icon className='size-6' />
				<h3>Контакт: {report.contactInfo} ({contactMethod.label})</h3>
				<MapPin className='size-6' />
				<h3>Адреса: {report.address}</h3>
				<Clock className='size-6' />
				<h3>Пријавено на: {submittedAt}</h3>
				{
					report.isAccepted === true && (
						<div className=" bg-green-400/20 text-green-400 rounded-lg w-fit px-3 py-1 grid grid-cols-subgrid col-span-2">
							<Check className='size-6' />
							<h3>Пријавата е прегледана и прифатена</h3>
						</div>
					)
				}
			</div>

			{
				(acceptReportBtn || deleteReportBtn) && (
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
								<Button variant='destructive' className="col-start-2 col-span-1" onClick={deleteReport} disabled={isDeletePostPending}>
									<Trash className="size-6 mr-2" /> Избриши
								</Button>
							)
						}
					</div>
				)
			}
		</div>
	);
}