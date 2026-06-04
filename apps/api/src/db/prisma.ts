import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "../../config/env";

const connectionString: string | undefined = env.DATABASE_URL;

if (connectionString === undefined) {
	throw new Error("DATABASE_URL is not set");
}

export const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString })
});
