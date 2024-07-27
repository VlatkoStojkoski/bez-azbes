import type { User } from "@clerk/nextjs/server";
import type { Location } from "./api";

export const locations: Location[] = [
	{
		id: "p0000",
		location: { lat: 42.005111, lng: 21.3575051 },
		address: "ул. Ѓорче Петров бр 15",
		submittedBy: "u0001"
	},
	{
		id: "p0001",
		location: { lat: 42.004719, lng: 21.3502841 },
		address: "ул. Ѓорче Петров бр 17",
		submittedBy: "u0001"
	},
	{
		id: "p0002",
		location: { lat: 42.001155, lng: 21.3504771 },
		address: "ул. Ѓорче Петров бр 22",
		submittedBy: "u0001"
	},
	{
		id: "p0003",
		location: { lat: 42.00998, lng: 21.3458421 },
		address: "ул. 4 Јули бр 20",
		submittedBy: "u0002"
	},
	{
		id: "p0004",
		location: { lat: 42.0206756, lng: 21.3531575 },
		address: "ул. 4 Јули бр 25",
		submittedBy: "u0002"
	},
	{
		id: "p0005",
		location: { lat: 42.018221, lng: 21.357675 },
		address: "ул. Македонска Преродба бр 5",
		submittedBy: "u0002"
	},
	{
		id: "p0006",
		location: { lat: 42.0349526, lng: 21.3488648 },
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