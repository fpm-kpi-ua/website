import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "~/drizzle/schema";

const sqlite = new Database("./src/drizzle/sqlite.db");
export const db = drizzle(sqlite, { schema, logger: true });

migrate(db, { migrationsFolder: "./src/drizzle/migrations" });
