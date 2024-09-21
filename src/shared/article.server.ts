"use server";

import { and, desc, eq, max, sql } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { p_readArticle, p_sectionPreview } from "~/drizzle/prepared-queries";
import { t_articles } from "~/drizzle/schema";
import type { InsertArticle } from "~/shared/schemas";
import type { Lang, Section } from "~/shared/types";

export function getArticlePreviews(lang: Lang, section: Section) {
	return p_sectionPreview.all({ lang, section });
}

export function getAdminArticlePreviews(lang: Lang, section: Section) {
	// TODO: return non published articles for admin and indicator if has new version
	const mv = db
		.select({
			lang: t_articles.lang,
			section: t_articles.section,
			slug: t_articles.slug,
			maxVersion: max(t_articles.createdAt).as("maxVersion"),
		})
		.from(t_articles)
		.where(and(eq(t_articles.lang, lang), eq(t_articles.section, section)))
		.groupBy(t_articles.lang, t_articles.section, t_articles.slug)
		.as("maxVersions");

	return db
		.select({
			slug: t_articles.slug,
			title: t_articles.title,
			description: t_articles.description,
		})
		.from(t_articles)
		.rightJoin(
			mv,
			and(
				eq(t_articles.slug, mv.slug),
				eq(t_articles.createdAt, mv.maxVersion),
				eq(t_articles.lang, mv.lang),
				eq(t_articles.section, mv.section),
			),
		)
		.where(
			and(
				eq(t_articles.lang, lang),
				eq(t_articles.section, section),
				eq(t_articles.isActive, true),
			),
		)
		.orderBy(t_articles.title)
		.all();
}

export function getReadArticle(lang: Lang, section: Section, slug: string) {
	return p_readArticle.get({ lang, section, slug });
}

export function getEditArticle(
	lang: Lang,
	section: Section,
	slug: string,
	version?: number,
) {
	return db
		.select()
		.from(t_articles)
		.where(
			and(
				eq(t_articles.lang, lang),
				eq(t_articles.section, section),
				eq(t_articles.slug, slug),
				version ? eq(t_articles.createdAt, version) : undefined,
			),
		)
		.orderBy(t_articles.isActive)
		.get();
}

export function getArticleHistory(lang: Lang, section: Section, slug: string) {
	return db
		.select()
		.from(t_articles)
		.where(
			and(
				eq(t_articles.lang, lang),
				eq(t_articles.section, section),
				eq(t_articles.slug, slug),
			),
		)
		.orderBy(desc(t_articles.createdAt))
		.all();
}

export function saveArticle(article: InsertArticle) {
	return db.insert(t_articles).values(article).returning().get();
}

export function publishArticle(
	lang: Lang,
	section: Section,
	slug: string,
	createdAt: number,
) {
	return db
		.update(t_articles)
		.set({
			isActive: sql`case when ${eq(
				t_articles.createdAt,
				createdAt,
			)} then 1 else 0 end`,
		})
		.where(
			and(
				eq(t_articles.lang, lang),
				eq(t_articles.section, section),
				eq(t_articles.slug, slug),
			),
		)
		.run();
}

export function unpublishArticle(lang: Lang, section: Section, slug: string) {
	return db
		.update(t_articles)
		.set({ isActive: false })
		.where(
			and(
				eq(t_articles.lang, lang),
				eq(t_articles.section, section),
				eq(t_articles.slug, slug),
			),
		)
		.run();
}
