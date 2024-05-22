"use server";

import { and, eq, max, sql } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { type InsertArticle, articles } from "~/drizzle/schema";
import type { Lang, Section } from "./types";

export function getArticlePreviews(lang: Lang, section: Section) {
	return db
		.select({
			slug: articles.slug,
			title: articles.title,
			description: articles.description,
		})
		.from(articles)
		.where(
			and(
				eq(articles.lang, lang),
				eq(articles.section, section),
				eq(articles.isActive, true),
			),
		)
		.orderBy(articles.title)
		.all();
}

export function getAdminArticlePreviews(lang: Lang, section: Section) {
	// TODO: return non published articles for admin and indicator if has new version
	const mv = db
		.select({
			lang: articles.lang,
			section: articles.section,
			slug: articles.slug,
			maxVersion: max(articles.createdAt).as("maxVersion"),
		})
		.from(articles)
		.where(and(eq(articles.lang, lang), eq(articles.section, section)))
		.groupBy(articles.lang, articles.section, articles.slug)
		.as("maxVersions");

	return db
		.select({
			slug: articles.slug,
			title: articles.title,
			description: articles.description,
		})
		.from(articles)
		.rightJoin(
			mv,
			and(
				eq(articles.slug, mv.slug),
				eq(articles.createdAt, mv.maxVersion),
				eq(articles.lang, mv.lang),
				eq(articles.section, mv.section),
			),
		)
		.where(
			and(
				eq(articles.lang, lang),
				eq(articles.section, section),
				eq(articles.isActive, true),
			),
		)
		.orderBy(articles.title)
		.all();
}

export function getReadArticle(lang: Lang, section: Section, slug: string) {
	return db
		.select({
			title: articles.title,
			description: articles.description,
			keywords: articles.keywords,
			html: articles.html,
			lang: articles.articleLang,
		})
		.from(articles)
		.where(
			and(
				eq(articles.lang, lang),
				eq(articles.section, section),
				eq(articles.slug, slug),
				eq(articles.isActive, true),
			),
		)
		.limit(1)
		.all()[0];
}

export function getEditArticle(
	lang: Lang,
	section: Section,
	slug: string,
	version?: number,
) {
	return db
		.select()
		.from(articles)
		.where(
			and(
				eq(articles.lang, lang),
				eq(articles.section, section),
				eq(articles.slug, slug),
				version ? eq(articles.createdAt, version) : undefined,
			),
		)
		.orderBy(articles.isActive)
		.limit(1)
		.all()[0];
}

export function getArticleHistory(lang: Lang, section: Section, slug: string) {
	return db
		.select()
		.from(articles)
		.where(
			and(
				eq(articles.lang, lang),
				eq(articles.section, section),
				eq(articles.slug, slug),
			),
		)
		.orderBy(articles.createdAt)
		.all();
}

export function saveArticle(article: InsertArticle) {
	return db.insert(articles).values(article).returning().get();
}

export function publishArticle(
	lang: Lang,
	section: Section,
	slug: string,
	createdAt: number,
) {
	return db
		.update(articles)
		.set({
			isActive: sql`case when ${eq(
				articles.createdAt,
				createdAt,
			)} then 1 else 0 end`,
		})
		.where(
			and(
				eq(articles.lang, lang),
				eq(articles.section, section),
				eq(articles.slug, slug),
			),
		)
		.run();
}

export function unpublishArticle(lang: Lang, section: Section, slug: string) {
	return db
		.update(articles)
		.set({ isActive: false })
		.where(
			and(
				eq(articles.lang, lang),
				eq(articles.section, section),
				eq(articles.slug, slug),
			),
		)
		.run();
}
