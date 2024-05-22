import { Meta, Title } from "@solidjs/meta";
import {
	type RouteLoadFuncArgs,
	cache,
	createAsync,
	useParams,
} from "@solidjs/router";
import { For, Show } from "solid-js";
import { ArticleCard } from "~/components/ArticleCard";
import { ThemedIcon } from "~/components/ThemedIcon";
import { getArticlePreviews } from "~/shared/article";
import { existingSections } from "~/shared/constants";
import { langLink, parseLang } from "~/shared/lang";
import type { Lang, Section } from "~/shared/types";
import { useTranslation } from "~/shared/useTranslation";
import "./(section).css";
// TODO: add error handling, add edit and create new article links

const getSectionPreview = cache(async (lang: Lang, section: Section) => {
	"use server";
	if (!existingSections.includes(section))
		throw new Error("Such section does not exist");
	return getArticlePreviews(lang, section);
}, "sections");

const images: Record<
	Section,
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
	load: ({ params }: RouteLoadFuncArgs) => {
		getSectionPreview(parseLang(params.lang), params.section as Section);
	},
};

export default function Sections() {
	const params = useParams<{
		lang: Lang;
		section: Section;
	}>();
	const articlesPreview = createAsync(() =>
		getSectionPreview(params.lang, params.section),
	);

	const { t } = useTranslation();
	return (
		<>
			<Title>{t(`header.${params.section}`)}</Title>
			<Meta
				name="description"
				content={t("sectionDescription", {
					section: t(`header.${params.section}`),
				})}
			/>
			<div class="mx-auto max-w-max-page-width">
				<h2 class="sr-only">Sections</h2>
				<ul class="grid list-none grid-cols-1 gap-4 md:grid-cols-2">
					<Show when={images[params.section].first?.path}>
						<li class={images[params.section].first.class}>
							<ThemedIcon
								path={images[params.section].first.path}
								class="h-fit"
							/>
						</li>
					</Show>
					<For each={articlesPreview()}>
						{(article, i) => (
							<>
								<Show when={images[params.section][i()]?.path}>
									<li class={images[params.section][i()].class}>
										<ThemedIcon path={images[params.section][i()].path} />
									</li>
								</Show>
								<li>
									<ArticleCard
										title={article.title ?? ""}
										description={article.description ?? ""}
										href={langLink(
											params.lang,
											`${params.section}/${article.slug}`,
										)}
									/>
								</li>
							</>
						)}
					</For>
					<Show when={images[params.section].last?.path}>
						<li class={images[params.section].last.class}>
							<ThemedIcon path={images[params.section].last.path} />
						</li>
					</Show>
				</ul>
			</div>
		</>
	);
}
