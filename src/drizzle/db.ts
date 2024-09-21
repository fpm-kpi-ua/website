import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "~/drizzle/schema";

const sqlite = new Database("./src/drizzle/sqlite.db");
export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: "./src/drizzle/migrations" });
