'use client';

import { useCallback, useState } from 'react';

import { DialogTitle } from '@radix-ui/react-dialog';
import { APIProvider, AdvancedMarker, Map, type MapProps } from '@vis.gl/react-google-maps';

import LogoIcon from '@/components/icons/logo';
import { ReportDetailsContent, ReportDetailsContentProps } from '@/components/report-details-content';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { env } from '@/env';
import { getReport } from '@/lib/api/reports';
import { ClientReport } from '@/lib/api/reports.model';
import { defaultLocation } from '@/lib/utils';

interface MapViewProps extends MapProps {
	reports: ClientReport[];
	acceptReportBtn?: boolean;
	deleteReportBtn?: boolean;
	selectedReportId?: string;
}

export function MapView({ reports: initReports, acceptReportBtn, deleteReportBtn, selectedReportId, ...props }: MapViewProps) {
	const [reports, setReports] = useState(initReports);

	const refreshReport = useCallback(async (id: string) => {
		try {
			const updatedReportRes = await getReport(id);

			if (updatedReportRes.success !== true || updatedReportRes.data.isDeleted === true) {
				setReports((prevReports) => prevReports.filter((report) => report.id !== id));
				return;
			}

			const { data: updatedReport } = updatedReportRes;

			setReports((prevReports) =>
				prevReports.map((report) => (report.id === id ? updatedReport : report))
			);
		} catch (error) {
			console.error("Failed to refresh report:", error);
		}
	}, []);

	return (
		<APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
			<Map
				mapId={env.NEXT_PUBLIC_MAPS_MAP_ID}
				defaultZoom={14}
				defaultCenter={defaultLocation}
				mapTypeId='hybrid'
				{...props}>
				{reports.map((report: ClientReport) => (
					<ReportMarker
						key={report.id}
						report={report}
						acceptReportBtn={acceptReportBtn}
						deleteReportBtn={deleteReportBtn}
						isOpen={report.id === selectedReportId}
						refreshReport={refreshReport} />
				))}
			</Map>

		</APIProvider>
	);
}

type ReportMarkerProps = {
	isOpen?: boolean;
} & ReportDetailsContentProps;

function ReportMarker({ isOpen: initIsOpen, report, ...props }: ReportMarkerProps) {
	const [isOpen, setIsOpen] = useState(initIsOpen);

	return (
		<AdvancedMarker
			key={report.id}
			position={{
				lat: report.locationLat,
				lng: report.locationLng,
			}}
		>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger>
					<LogoIcon className='size-10' />
				</DialogTrigger>
				<DialogContent className='rounded-lg'>
					<DialogTitle className='hidden'>{report.description}</DialogTitle>
					<ReportDetailsContent report={report} {...props} />
				</DialogContent>
			</Dialog>
		</AdvancedMarker>
	);
}