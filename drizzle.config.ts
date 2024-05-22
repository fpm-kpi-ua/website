import type { Config } from "drizzle-kit";

export default {
	schema: "./src/drizzle/schema.ts",
	out: "./src/drizzle/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: "./src/drizzle/sqlite.db",
	},
} satisfies Config;
