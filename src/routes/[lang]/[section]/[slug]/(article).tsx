import { Meta, Title } from "@solidjs/meta";
import {
	type RouteDefinition,
	cache,
	createAsync,
	useParams,
} from "@solidjs/router";
import { getReadArticle } from "~/shared/article.server";
import { existingSections } from "~/shared/constants";
import { parseLang } from "~/shared/lang";
import type { Lang, Section } from "~/shared/types";

const getArticle = cache(async (lang: Lang, section: Section, slug: string) => {
	"use server";
	if (!existingSections.includes(section)) {
		throw "Such section does not exist";
	}
	return getReadArticle(lang, section, slug);
}, "article");

export const route: RouteDefinition = {
	preload: ({ params }) => {
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
				lang={article()?.articleLang}
				innerHTML={article()?.html}
			/>
		</>
	);
}
