import { Meta, Title } from "@solidjs/meta";
import {
	type RouteLoadFuncArgs,
	cache,
	createAsync,
	useParams,
} from "@solidjs/router";
import { and, eq, max } from "drizzle-orm";
import { For } from "solid-js";
import { ArticleCard } from "~/components/ArticleCard";
import { ThemedIcon } from "~/components/ThemedIcon";
import { db } from "~/drizzle/db";
import { articles } from "~/drizzle/schema";
import { existingSections } from "~/shared/constants";
import { langLink } from "~/shared/lang";
import type { Lang } from "~/shared/types";
import { useTranslation } from "~/shared/useTranslation";
import "./index.css";
// TODO: add error handling, add edit and create new article links

const getSectionPreview = cache(
	async (lang: Lang, section: (typeof existingSections)[number]) => {
		"use server";
		if (!existingSections.includes(section))
			throw new Error("Such section does not exist");
		const mv = db
			.select({
				lang: articles.lang,
				section: articles.section,
				slug: articles.slug,
				maxVersion: max(articles.version).as("maxVersion"),
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
					eq(articles.version, mv.maxVersion),
					eq(articles.lang, mv.lang),
					eq(articles.section, mv.section),
				),
			)
			.where(
				and(
					eq(articles.lang, lang),
					eq(articles.section, section),
					eq(articles.isPublished, true),
				),
			)
			.orderBy(articles.title)
			.all();
	},
	"sections",
);

const images: Record<
	(typeof existingSections)[number],
	Record<number | "first" | "last", { class: string; path: string }>
> = {
	about: {
		first: { class: "icon", path: "person/2" },
		8: {
			class: "icon--big flip hidden md:flex",
			path: "person/3",
		},
		last: {
			class: "icon flex md:hidden icon--footer",
			path: "person/footer-2",
		},
	},
	admission: {
		first: { class: "icon--big", path: "person/4" },
		last: {
			class: "icon flex md:hidden icon--footer",
			path: "person/footer-1",
		},
	},
	study: {
		first: { class: "icon--big", path: "person/5" },
		3: {
			class: "icon--big flip hidden md:flex",
			path: "person/6",
		},
		last: {
			class: "icon flex md:hidden icon--footer",
			path: "person/footer-2",
		},
	},
	deanery: {
		first: { class: "icon--big", path: "person/5" },
		5: {
			class: "icon--big  hidden md:flex",
			path: "person/6",
		},
		last: {
			class: "icon flex md:hidden icon--footer",
			path: "person/footer-1",
		},
	},
	information: {
		first: { class: "icon--big", path: "person/7" },
		10: {
			class: "icon flip hidden md:flex",
			path: "person/3",
		},
		last: {
			class: "icon  flex md:hidden icon--footer",
			path: "person/footer-3",
		},
	},
};

export const route = {
	load: ({ location }: RouteLoadFuncArgs) => {
		const [, lang, section] = location.pathname.split("/");
		getSectionPreview(
			lang as Lang,
			section as (typeof existingSections)[number],
		);
	},
};

export default function Sections() {
	const params = useParams<{
		lang: Lang;
		section: (typeof existingSections)[number];
	}>();
	const articlesPreview = createAsync(() =>
		getSectionPreview(params.lang, params.section),
	);

	const { t } = useTranslation();
	return (
		<div class="mx-auto max-w-max-page-width">
			<Title>{t(`header.${params.section}`)}</Title>
			<Meta
				name="description"
				content={t("sectionDescription", {
					section: t(`header.${params.section}`),
				})}
			/>
			<h2 class="sr-only">Sections</h2>
			<ul class="grid list-none grid-cols-1 gap-4 md:grid-cols-2">
				{images[params.section].first && (
					<li class={images[params.section].first.class}>
						<ThemedIcon
							path={images[params.section].first.path}
							class="h-fit"
						/>
					</li>
				)}
				<For each={articlesPreview()}>
					{(article, i) => (
						<>
							{images[params.section][i()] && (
								<li class={images[params.section][i()].class}>
									<ThemedIcon path={images[params.section][i()].path} />
								</li>
							)}
							<li>
								<ArticleCard
									title={article.title!}
									description={article.description!}
									href={langLink(
										params.lang,
										`${params.section}/${article.slug}`,
									)}
								/>
							</li>
						</>
					)}
				</For>
				{images[params.section].last && (
					<li class={images[params.section].last.class}>
						<ThemedIcon path={images[params.section].last.path} />
					</li>
				)}
			</ul>
		</div>
	);
}
