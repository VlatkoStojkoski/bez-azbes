import { User } from "@clerk/nextjs/server";
import { UserTotalSurfaceArea } from "@prisma/client";

export type ClientRanking = UserTotalSurfaceArea & { user: User | null; rank: number };