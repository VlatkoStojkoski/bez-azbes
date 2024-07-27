'use client';

import { APIProvider, AdvancedMarker, Map, type MapProps } from '@vis.gl/react-google-maps';
import { env } from '@/env';
import LogoIcon from '@/components/icons/logo';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Location } from '@/utils/api';
import { defaultLocation } from '@/lib/utils';

interface MapViewProps extends MapProps {
	locations: Location[];
}

export function MapView({ locations, ...props }: MapViewProps) {
	return (
		<APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
			<Map
				mapId={env.NEXT_PUBLIC_MAPS_MAP_ID}
				defaultZoom={14}
				defaultCenter={defaultLocation}
				mapTypeId='hybrid'
				{...props}>
				{locations.map((location: Location) => (
					<PoiMarker key={location.id} location={location} />
				))}
			</Map>

		</APIProvider>
	);
}

function PoiMarker({ location }: { location: Location }) {
	return (
		<AdvancedMarker
			key={location.id}
			position={location.location}
			onClick={() => { }}
		>
			<Dialog>
				<DialogTrigger>
					<LogoIcon className='size-10' />
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{location.address}
						</DialogTitle>
						<DialogDescription>lmao</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</AdvancedMarker>
	);
}