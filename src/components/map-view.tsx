'use client';

import { useMemo, useState } from 'react';

import { APIProvider, AdvancedMarker, Map, type MapProps } from '@vis.gl/react-google-maps';
import { MapPin, User } from 'lucide-react';
import { useAsyncMemo } from "use-async-memo";

import LogoIcon from '@/components/icons/logo';
import { ReportDetailsContent } from '@/components/report-details-content';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { env } from '@/env';
import { getReportPictureUrl } from '@/lib/api/reports';
import { DBReport } from '@/lib/api/reports.model';
import { contactMethods, defaultLocation } from '@/lib/utils';

interface MapViewProps extends MapProps {
	reports: DBReport[];
}

export function MapView({ reports, ...props }: MapViewProps) {
	return (
		<APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
			<Map
				mapId={env.NEXT_PUBLIC_MAPS_MAP_ID}
				defaultZoom={14}
				defaultCenter={defaultLocation}
				mapTypeId='hybrid'
				{...props}>
				{reports.map((location: DBReport) => (
					<PoiMarker key={location.id} report={location} />
				))}
			</Map>

		</APIProvider>
	);
}

function PoiMarker({ report }: { report: DBReport }) {
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
					<DialogHeader>
						<DialogTitle className='text-left w-[95%] leading-snug'>
							{report.description}
						</DialogTitle>
					</DialogHeader>

					<ReportDetailsContent report={report} shouldGetImage={hasBeenOpened} />
				</DialogContent>
			</Dialog>
		</AdvancedMarker>
	);
}