import { Meta, Title } from "@solidjs/meta";
import {
	type RouteLoadFuncArgs,
	cache,
	createAsync,
	useParams,
} from "@solidjs/router";
import { and, desc, eq } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { articles } from "~/drizzle/schema";
import { existingSections } from "~/shared/constants";
import { parseLang } from "~/shared/lang";
import type { Lang, Section } from "~/shared/types";

const getArticle = cache(async (lang: Lang, section: Section, slug: string) => {
	"use server";
	if (!existingSections.includes(section)) {
		throw new Error("Such section does not exist");
	}
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
				eq(articles.isPublished, true),
			),
		)
		.orderBy(desc(articles.version))
		.limit(1)
		.all()[0];
}, "article");

export const route = {
	load: ({ params }: RouteLoadFuncArgs) => {
		getArticle(parseLang(params.lang), params.section as Section, params.slug);
	},
};

export default function Article() {
	const params = useParams<{
		lang: Lang;
		section: Section;
		slug: string;
	}>();

	const article = createAsync(() =>
		getArticle(params.lang, params.section, params.slug),
	);
	return (
		<>
			<Title>{article()?.title}</Title>
			<Meta name="description" content={article()?.description} />
			<Meta name="keywords" content={article()?.keywords ?? ""} />
			<article
				class="prose mx-auto max-w-max-page-width"
				lang={article()?.lang}
				innerHTML={article()?.html}
			/>
		</>
	);
}
