import { useEffect, useMemo, useState } from "react";

import { MapPin, User } from "lucide-react";
import { useAsyncMemo } from "use-async-memo";

import { getReportPictureUrl } from "@/lib/api/reports";
import { DBReport } from "@/lib/api/reports.model";
import { contactMethods } from "@/lib/utils";

export function ReportDetailsContent({ report, shouldGetImage }: { report: DBReport, shouldGetImage?: boolean }) {
	const contactMethod = useMemo(() => {
		return contactMethods[report.contactMethod];
	}, [report.contactMethod]);

	const [pictureSrc, setPictureSrc] = useState<string | null>(null);

	useEffect(() => {
		if ((shouldGetImage ?? true) === false) {
			return;
		}

		getReportPictureUrl(report).then((pictureUrl) => {
			setPictureSrc(pictureUrl);
		});
	}, [report.pictureBucket, report.pictureKey, shouldGetImage, report]);

	return (
		<>
			<div className="w-full max-h-[400px] bg-background-secondary border mb-6">
				{
					pictureSrc !== null && (
						<img src={pictureSrc} alt={report.description} className='w-full h-full object-contain' />
					)
				}
			</div>

			<div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-4">
				<User className='size-6' />
				<h3>Пријавил: {report.contactFullName}</h3>
				<contactMethod.icon className='size-6' />
				<h3>Контакт: {report.contactInfo} ({contactMethod.label})</h3>
				<MapPin className='size-6' />
				<h3>Адреса: {report.address}</h3>
			</div>
		</>
	);
}