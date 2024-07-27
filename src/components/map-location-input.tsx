'use client';

import { type HTMLProps, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { env } from '@/env';
import { defaultLocation } from '@/lib/utils';

interface MapLocationInputProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
	onChange?: (location: google.maps.LatLngLiteral) => void;
}

export function MapLocationInput({
	onChange,
	...props
}: MapLocationInputProps) {
	const [isDragging, setIsDragging] = useState(false);

	return (
		<div className='relative w-full h-[400px]' {...props}>
			<APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
				<Map
					mapId={env.NEXT_PUBLIC_MAPS_MAP_ID}
					defaultZoom={14}
					defaultCenter={defaultLocation}
					mapTypeId='hybrid'
					disableDefaultUI
					onDragstart={() => setIsDragging(true)}
					onDragend={() => setIsDragging(false)}
					onCenterChanged={(ev) => onChange?.(ev.detail.center)}>
				</Map>
			</APIProvider>
			<MapPin
				fill='red'
				strokeWidth='1'
				className={
					twMerge(
						'absolute top-1/2 left-1/2 transform -translate-x-1/2 size-12 transition-transform duration-300',
						isDragging ? '-translate-y-[120%] scale-125' : '-translate-y-[100%] scale-100'
					)
				} />
		</div>
	);
}