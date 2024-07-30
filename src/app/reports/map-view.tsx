'use client';

import { useMemo, useState } from 'react';

import { APIProvider, AdvancedMarker, Map, type MapProps } from '@vis.gl/react-google-maps';
import { MapPin, User } from 'lucide-react';
import { useAsyncMemo } from "use-async-memo";

import LogoIcon from '@/components/icons/logo';
import {
	Dialog,
	DialogContent,
	DialogDescription,
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

	const contactMethod = useMemo(() => {
		return contactMethods[report.contactMethod];
	}, [report.contactMethod]);

	const pictureSrc = useAsyncMemo(async () => {
		if (!hasBeenOpened) {
			return null;
		}

		const pictureUrl = await getReportPictureUrl(report);

		console.log('PICTURE URL:', pictureUrl);

		return pictureUrl ?? null;
	}, [report.pictureBucket, report.pictureKey, hasBeenOpened], null);

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
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='text-left'>
							{report.description}
						</DialogTitle>
					</DialogHeader>

					{
						pictureSrc !== null && (
							<img src={pictureSrc} alt={report.description} className='w-full h-auto' />
						)
					}

					<div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-4">
						<User className='size-6' />
						<h3>Пријавил: {report.contactFullName}</h3>
						<contactMethod.icon className='size-6' />
						<h3>Контакт: {report.contactInfo} ({contactMethod.label})</h3>
						<MapPin className='size-6' />
						<h3>Адреса: {report.address}</h3>
					</div>
				</DialogContent>
			</Dialog>
		</AdvancedMarker>
	);
}