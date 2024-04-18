import { action, cache, createAsync, useParams } from "@solidjs/router";
import { and, desc, eq } from "drizzle-orm";
import { createEffect, createSignal } from "solid-js";
import { Show } from "solid-js";
import { db } from "~/drizzle/db";
import { articles } from "~/drizzle/schema";
import { existingSections } from "~/shared/constants";
import { mdxToHtml } from "~/shared/mdxToHtml";
import type { Lang, Section } from "~/shared/types";
import { useTranslation } from "~/shared/useTranslation";
import "./edit.css";

const save = action(async (data: FormData) => {
	"use server";
	console.log(Object.fromEntries(data));
	return "ok";
}, "save");

const getArticle = cache(async (lang: Lang, section: Section, slug: string) => {
	"use server";
	if (!existingSections.includes(section)) {
		throw new Error("Such section does not exist");
	}
	return db
		.select()
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

export default function EditArticle() {
	const { t } = useTranslation("admin");
	const params = useParams<{
		lang: Lang;
		section: Section;
		slug: string;
	}>();
	const article = createAsync(() =>
		getArticle(params.lang, params.section, params.slug),
	);
	const [html, setHtml] = createSignal("");
	const [mdx, setMdx] = createSignal(article()?.source ?? "");

	createEffect(() => {
		typeof article()?.source === "string" && setMdx(article()?.source!);
	});

	createEffect(async () => {
		const htm = await mdxToHtml(mdx());
		setHtml(htm ?? "");
	});

	return (
		<div class="flex w-full flex-col gap-4 lg:flex-row">
			<div class="@container w-full">
				<form
					method="post"
					action={save}
					class="grid size-full h-[calc(var(--vh)_-_theme('spacing.header-height')_-_2_*_theme('spacing.sides-padding'))] gap-y-4 [grid-template-areas:'meta''editor''buttons'] [grid-template-columns:1fr_max-content] [grid-template-rows:max-content_1fr_max-content] @lg:[grid-template-areas:'meta_buttons''editor_editor'] @lg:[grid-template-rows:max-content_1fr]"
				>
					<details class="[grid-area:meta]">
						<summary class="mb-2 w-max rounded">{article()?.title}</summary>
						<label class="mt-2 grid">
							<span>{t("slug")}</span>
							<input
								name="slug"
								value={article()?.slug}
								class="rounded border border-border bg-background px-2 py-1 text-text hover:border-primary"
							/>
						</label>
						<label class="mt-2 grid">
							<span>{t("title")}</span>
							<input
								name="title"
								value={article()?.title}
								class="rounded border border-border bg-background px-2 py-1 text-text hover:border-primary"
							/>
						</label>
						<label class="mt-2 grid">
							<span>{t("description")}</span>
							<textarea
								name="description"
								class="h-28 rounded border border-border bg-background px-2 py-1 text-text @lg:h-20 hover:border-primary"
							>
								{article()?.description}
							</textarea>
						</label>
						<label class="mt-2 grid">
							<span>{t("keywords")}</span>
							<input
								name="keywords"
								value={article()?.keywords ?? ""}
								class="rounded border border-border bg-background px-2 py-1 text-text hover:border-primary"
							/>
						</label>
						<label class="mt-2 grid">
							<span>{t("articleLang")}</span>
							<select
								name="lang"
								value={article()?.articleLang}
								class="w-min rounded border border-border bg-background px-2 py-1 text-text hover:border-primary"
							>
								<option selected={article()?.articleLang === "en"}>en</option>
								<option selected={article()?.articleLang === "uk"}>uk</option>
							</select>
						</label>
					</details>
					<div class="flex w-full gap-2 [grid-area:buttons] @lg:absolute @lg:right-0 @lg:w-min">
						<button type="button" name="isPublished" value="true">
							{t("publish")}
						</button>
						<button type="submit" class="btn--primary w-full">
							{t("save")}
						</button>
					</div>
					<input name="html" value={html()} hidden />
					<textarea
						name="source"
						class="resize-none overflow-x-scroll whitespace-pre rounded border border-border bg-background px-2 py-1 font-mono text-text [grid-area:editor] hover:border-primary"
						onInput={(e) => setMdx(e.currentTarget.value)}
					>
						{mdx()}
					</textarea>
				</form>
			</div>
			<Show when={true}>
				<article
					class="prose w-full overflow-y-auto text-wrap break-words lg:h-[calc(var(--vh)_-_theme('spacing.header-height')_-_2_*_theme('spacing.sides-padding'))] lg:w-[50%]"
					innerHTML={html()}
				/>
			</Show>
		</div>
	);
}
