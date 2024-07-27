import { waitTime } from "./general";
import { locations } from "./test-data";

export interface Location {
	id: string;
	location: google.maps.LatLngLiteral;
	address: string;
	submittedBy: string;
}

export async function getLocations(): Promise<Location[]> {
	await waitTime(1000);

	return locations;
}
