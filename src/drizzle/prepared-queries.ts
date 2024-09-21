import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "./db";
import {
	t_admins,
	t_articles,
	t_contentManagers,
	t_news,
	t_students,
	t_teachers,
	t_users,
} from "./schema";

export const p_getUserInfo = db
	.select({
		id: t_users.id,
		email: t_users.email,
		firstName: t_users.firstName,
		lastName: t_users.lastName,
		isActive: t_users.isActive,
		createdAt: t_users.createdAt,
		admin: t_admins,
		teacher: t_teachers,
		student: t_students,
		contentManager: t_contentManagers,
	})
	.from(t_users)
	.where(eq(t_users.id, sql.placeholder("id")))
	.leftJoin(t_admins, eq(t_admins.userId, t_users.id))
	.leftJoin(t_teachers, eq(t_teachers.userId, t_users.id))
	.leftJoin(t_contentManagers, eq(t_contentManagers.userId, t_users.id))
	.leftJoin(t_students, eq(t_students.userId, t_users.id))
	.prepare();

export const p_getUserByEmail = db
	.select({
		id: t_users.id,
		email: t_users.email,
		password: t_users.password,
		salt: t_users.salt,
		isActive: t_users.isActive,
	})
	.from(t_users)
	.where(eq(t_users.email, sql.placeholder("email")))
	.prepare();

export const p_sectionPreview = db
	.select({
		slug: t_articles.slug,
		title: t_articles.title,
		description: t_articles.description,
	})
	.from(t_articles)
	.where(
		and(
			eq(t_articles.lang, sql.placeholder("lang")),
			eq(t_articles.section, sql.placeholder("section")),
			eq(t_articles.isActive, true),
		),
	)
	.orderBy(t_articles.title)
	.prepare();

export const p_readArticle = db
	.select({
		title: t_articles.title,
		description: t_articles.description,
		keywords: t_articles.keywords,
		html: t_articles.html,
		articleLang: t_articles.articleLang,
	})
	.from(t_articles)
	.where(
		and(
			eq(t_articles.lang, sql.placeholder("lang")),
			eq(t_articles.section, sql.placeholder("section")),
			eq(t_articles.slug, sql.placeholder("slug")),
			eq(t_articles.isActive, true),
		),
	)
	.prepare();

export const p_getNewsPreview = db
	.select({
		id: t_news.id,
		title: t_news.title,
		preview: t_news.preview,
		createdAt: t_news.createdAt,
	})
	.from(t_news)
	.where(eq(t_news.lang, sql.placeholder("lang")))
	.limit(sql.placeholder("limit"))
	.orderBy(desc(t_news.createdAt))
	.prepare();

export const p_getNewsList = db
	.select({
		id: t_news.id,
		title: t_news.title,
		html: t_news.html,
		createdAt: t_news.createdAt,
	})
	.from(t_news)
	.where(eq(t_news.lang, sql.placeholder("lang")))
	.orderBy(t_news.createdAt)
	.prepare();
