import { env } from "./config/env"
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: 'prisma',
	datasource: {
		url: env.DATABASE_URL
	},
	migrations: {
		path: 'prisma/migrations',
	},
});
