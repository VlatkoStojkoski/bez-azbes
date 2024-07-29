import type { User } from "@clerk/nextjs/server";

import type { DBReport } from "./reports.model";

export const reports: Partial<DBReport>[] = [
	{
		id: "p0000",
		locationLat: 42.005111,
		locationLng: 21.3575051,
		address: "ул. Ѓорче Петров бр 15",
		submittedBy: "u0001",
	},
	{
		id: "p0001",
		locationLat: 42.004719,
		locationLng: 21.3502841,
		address: "ул. Ѓорче Петров бр 17",
		submittedBy: "u0001"
	},
	{
		id: "p0002",
		locationLat: 42.001155,
		locationLng: 21.3504771,
		address: "ул. Ѓорче Петров бр 22",
		submittedBy: "u0001"
	},
	{
		id: "p0003",
		locationLat: 42.00998,
		locationLng: 21.3458421,
		address: "ул. 4 Јули бр 20",
		submittedBy: "u0002"
	},
	{
		id: "p0004",
		locationLat: 42.0206756,
		locationLng: 21.3531575,
		address: "ул. 4 Јули бр 25",
		submittedBy: "u0002"
	},
	{
		id: "p0005",
		locationLat: 42.018221,
		locationLng: 21.357675,
		address: "ул. Македонска Преродба бр 5",
		submittedBy: "u0002"
	},
	{
		id: "p0006",
		locationLat: 42.0349526,
		locationLng: 21.3488648,
		address: "ул. Македонска Преродба бр 17",
		submittedBy: "u0002"
	},
];

export const users: Record<string, User> = {
	u0001: {
		'fullName': 'John Doe',
	},
	u0002: {
		'fullName': 'Jane Doe',
	},
} as unknown as Record<string, User>;