import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		CLERK_SECRET_KEY: z.string().min(1),
		AWS_ACCESS_KEY_ID: z.string().min(1),
		AWS_SECRET_ACCESS_KEY: z.string().min(1),
		AWS_S3_PICS_BUCKET: z.string().min(1),
		AWS_S3_PICS_REGION: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
		NEXT_PUBLIC_MAPS_API_KEY: z.string().min(1),
		NEXT_PUBLIC_MAPS_MAP_ID: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_MAPS_API_KEY: process.env.NEXT_PUBLIC_MAPS_API_KEY,
		NEXT_PUBLIC_MAPS_MAP_ID: process.env.NEXT_PUBLIC_MAPS_MAP_ID,
	},
});