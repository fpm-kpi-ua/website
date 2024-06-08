import { relations, sql } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { existingSections, supportedLngs } from "~/shared/constants";

export const t_users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	email: text("email").unique("email_idx").notNull(),
	password: text("password").notNull(),
	salt: text("salt").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	active: integer("active", { mode: "boolean" }).default(false).notNull(),
	createdAt: integer("created_at")
		.default(sql`(strftime('%s','now') * 1000)`)
		.notNull(),
});

export const t_admins = sqliteTable("admins", {
	userId: text("user_id")
		.unique()
		.notNull()
		.references(() => t_users.id, { onDelete: "cascade" }),
	superAdmin: integer("super_admin", { mode: "boolean" })
		.default(false)
		.notNull(),
	createdAt: integer("created_at")
		.default(sql`(strftime('%s','now') * 1000)`)
		.notNull(),
});

export const t_teachers = sqliteTable("teachers", {
	userId: text("user_id")
		.unique()
		.notNull()
		.references(() => t_users.id, { onDelete: "cascade" }),
	folders: text("folders", { mode: "json" }).$type<string[] | null>(),
	takenSpace: integer("taken_space").default(0).notNull(),
	allowedSpace: integer("allowed_space").default(500000000).notNull(),
	createdAt: integer("created_at")
		.default(sql`(strftime('%s','now') * 1000)`)
		.notNull(),
});

export const t_students = sqliteTable("students", {
	userId: text("user_id")
		.unique()
		.notNull()
		.references(() => t_users.id, { onDelete: "cascade" }),
	group: text("group").notNull(),
	createdAt: integer("created_at")
		.default(sql`(strftime('%s','now') * 1000)`)
		.notNull(),
});

export const t_contentManagers = sqliteTable("content_managers", {
	userId: text("user_id")
		.unique()
		.notNull()
		.references(() => t_users.id, { onDelete: "cascade" }),
	createdAt: integer("created_at")
		.default(sql`(strftime('%s','now') * 1000)`)
		.notNull(),
});

export const t_news = sqliteTable("news", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	source: text("source").notNull(),
	preview: text("preview").notNull().default(""),
	html: text("html").notNull(),
	lang: text("lang", { enum: supportedLngs }).notNull(),
	createdAt: integer("created_at")
		.default(sql`(strftime('%s','now') * 1000)`)
		.notNull(),
});

export const t_articles = sqliteTable(
	"articles",
	{
		lang: text("lang", { enum: supportedLngs }).notNull(),
		section: text("section", { enum: existingSections }).notNull(),
		slug: text("slug").notNull(),
		title: text("title").notNull(),
		description: text("description").notNull(),
		keywords: text("keywords"),
		isActive: integer("is_active", { mode: "boolean" })
			.default(false)
			.notNull(),
		articleLang: text("article_lang", { enum: supportedLngs }).notNull(),
		source: text("source").notNull(),
		html: text("html").notNull(),
		modifiedBy: integer("modified_by")
			.notNull()
			.references(() => t_users.id),
		createdAt: integer("created_at")
			.default(sql`(strftime('%s','now') * 1000)`)
			.notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.lang, table.section, table.slug, table.createdAt],
		}),
	}),
);

export const t_resetTokens = sqliteTable("reset_tokens", {
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => t_users.id, { onDelete: "cascade" }),
	token: text("token").notNull(),
	expiresAt: integer("expires_at").notNull(),
});

// Relations
export const userRelations = relations(t_users, ({ one }) => ({
	admin: one(t_admins, {
		fields: [t_users.id],
		references: [t_admins.userId],
	}),
	teacher: one(t_teachers, {
		fields: [t_users.id],
		references: [t_teachers.userId],
	}),
	student: one(t_students, {
		fields: [t_users.id],
		references: [t_students.userId],
	}),
	contentManager: one(t_contentManagers, {
		fields: [t_users.id],
		references: [t_contentManagers.userId],
	}),
	resetToken: one(t_resetTokens, {
		fields: [t_users.id],
		references: [t_resetTokens.userId],
	}),
}));
