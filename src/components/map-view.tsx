'use client';

import { useState } from 'react';

import { APIProvider, AdvancedMarker, Map, type MapProps } from '@vis.gl/react-google-maps';

import LogoIcon from '@/components/icons/logo';
import { ReportDetailsContent } from '@/components/report-details-content';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { env } from '@/env';
import type { DBReport } from '@/lib/api/reports.model';
import { defaultLocation } from '@/lib/utils';

interface MapViewProps extends MapProps {
	reports: DBReport[];
	acceptReportBtn?: boolean;
	deleteReportBtn?: boolean;
}

export function MapView({ reports, acceptReportBtn, deleteReportBtn, ...props }: MapViewProps) {
	return (
		<APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
			<Map
				mapId={env.NEXT_PUBLIC_MAPS_MAP_ID}
				defaultZoom={14}
				defaultCenter={defaultLocation}
				mapTypeId='hybrid'
				{...props}>
				{reports.map((location: DBReport) => (
					<PoiMarker key={location.id} report={location} acceptReportBtn={acceptReportBtn} deleteReportBtn={deleteReportBtn} />
				))}
			</Map>

		</APIProvider>
	);
}

function PoiMarker({ report, acceptReportBtn, deleteReportBtn }: {
	report: DBReport;
	acceptReportBtn?: boolean;
	deleteReportBtn?: boolean;
}) {
	const [hasBeenOpened, setHasBeenOpened] = useState(false);

	return (
		<AdvancedMarker
			key={report.id}
			position={{
				lat: report.locationLat,
				lng: report.locationLng,
			}}
			onClick={() => { setHasBeenOpened(true); }}
		>
			<Dialog>
				<DialogTrigger onClick={() => setHasBeenOpened(true)}>
					<LogoIcon className='size-10' />
				</DialogTrigger>
				<DialogContent className='rounded-lg'>
					<ReportDetailsContent report={report} shouldGetImage={hasBeenOpened} acceptReportBtn={acceptReportBtn} deleteReportBtn={deleteReportBtn} />
				</DialogContent>
			</Dialog>
		</AdvancedMarker>
	);
}