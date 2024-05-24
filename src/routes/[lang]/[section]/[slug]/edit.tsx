import { Title } from "@solidjs/meta";
import {
	A,
	type RouteSectionProps,
	action,
	cache,
	createAsync,
	redirect,
	useAction,
	useLocation,
	useParams,
	useSubmission,
} from "@solidjs/router";
import { createInsertSchema } from "drizzle-valibot";
import { For, Show, createEffect, createSignal } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import * as v from "valibot";
import { Input } from "~/components/input";
import { Select } from "~/components/select";
import { Textarea } from "~/components/textarea";
import { articles } from "~/drizzle/schema";
import {
	getArticleHistory,
	getEditArticle,
	publishArticle,
	saveArticle,
	unpublishArticle,
} from "~/shared/article";
import { existingSections } from "~/shared/constants";
import { cx } from "~/shared/cx";
import { formatValidationErrors } from "~/shared/format-validation-errors";
import { mdxToHtml } from "~/shared/mdx-to-html";
import type { Lang, Section } from "~/shared/types";
import { useTranslation } from "~/shared/use-translation";
import "@valibot/i18n/uk";

const schema = v.omit(
	createInsertSchema(articles, {
		title: v.string([v.minLength(1), v.maxLength(255)]),
		slug: v.string([v.regex(/^[a-z0-9-]+$/)]),
		isActive: (schema) => v.coerce(schema.isActive, (i) => i === "true"),
	}),
	["createdAt"],
);

const unpublish = action(async (lang: Lang, section: Section, slug: string) => {
	"use server";
	unpublishArticle(lang, section, slug);
	return {};
}, "article-versions");

const save = action(async (data: FormData) => {
	"use server";
	const referrer = getRequestEvent()?.request.headers.get("referer");
	if (!referrer) return;
	const url = new URL(referrer);
	const [, lang, section, slug] = url.pathname.split("/");
	let createdAt = Number(url.searchParams.get("createdAt"));
	const input = Object.assign(
		{ lang, section, slug, modifiedBy: 0 },
		Object.fromEntries(data),
	);
	const res = v.safeParse(schema, input, { lang });
	if (!res.success) {
		return formatValidationErrors(res.issues);
	}
	const article = res.output;

	if (createdAt) {
		const oldArticle = getEditArticle(
			lang as Lang,
			section as Section,
			slug,
			+createdAt,
		);
		// save article only if it has changed
		if (
			oldArticle?.slug !== article.slug ||
			oldArticle?.title !== article.title ||
			oldArticle?.description !== article.description ||
			oldArticle?.keywords !== article.keywords ||
			oldArticle?.html !== article.html ||
			oldArticle?.articleLang !== article.articleLang ||
			oldArticle?.source !== article.source
		) {
			createdAt = saveArticle(article).createdAt;
		}
	} else {
		createdAt = saveArticle(article).createdAt;
	}
	if (article.isActive) {
		publishArticle(article.lang, article.section, article.slug, createdAt);
	}
	if (article.slug !== slug) {
		return redirect(`/${article.lang}/${article.section}/${article.slug}/edit`);
	}
	url.searchParams.set("createdAt", createdAt.toString());
	return redirect(url.toString());
}, "article-edit");

const getArticle = cache(
	async (lang: Lang, section: Section, slug: string, version?: number) => {
		"use server";
		if (!existingSections.includes(section)) {
			throw new Error("Such section does not exist");
		}
		return getEditArticle(lang, section, slug, version);
	},
	"article-edit",
);

const getArticleVersions = cache(
	async (lang: Lang, section: Section, slug: string) => {
		"use server";
		if (!existingSections.includes(section)) {
			throw new Error("Such section does not exist");
		}
		return getArticleHistory(lang, section, slug);
	},
	"article-versions",
);

function getSearchParams(name: string, value: string | number) {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	searchParams.set(name, value.toString());
	return `?${searchParams.toString()}`;
}

export default function EditArticle({ location }: RouteSectionProps) {
	const { t } = useTranslation("admin");
	const params = useParams<{
		lang: Lang;
		section: Section;
		slug: string;
	}>();
	const article = createAsync(() =>
		getArticle(
			params.lang,
			params.section,
			params.slug,
			+location.query.createdAt,
		),
	);
	const [html, setHtml] = createSignal("");
	const [mdx, setMdx] = createSignal(article()?.source ?? "");
	const submission = useSubmission(save);
	const [title, setTitle] = createSignal(article()?.title ?? "");

	const oppositeMode = () =>
		location.query.mode === "history" ? "edit" : "history";

	createEffect(() => {
		typeof article()?.source === "string" && setMdx(article()?.source!);
		typeof article()?.title === "string" && setTitle(article()?.title!);
	});

	createEffect(async () => {
		const { innerHTML } = await mdxToHtml(mdx());
		if (!innerHTML) return;
		setHtml(innerHTML);
	});

	return (
		<>
			<Title>{article()?.title}</Title>
			<div class="flex w-full flex-col gap-2 lg:flex-row">
				<div class="@container w-full">
					<form
						method="post"
						action={save}
						class="grid size-full h-[calc(var(--vh)_-_theme('spacing.header-height')_-_2_*_theme('spacing.sides-padding'))] gap-y-4 [grid-template-areas:'meta_mode''editor_editor''buttons_buttons'] [grid-template-columns:1fr_max-content] [grid-template-rows:max-content_1fr_max-content] @xl:gap-x-2 @xl:[grid-template-areas:'meta_buttons''editor_editor'] @xl:[grid-template-rows:max-content_1fr]"
					>
						<details class="[grid-area:meta]">
							<summary class="mb-2 w-max select-none rounded">
								{title() || t("title")}
							</summary>
							<Input
								label={t("slug")}
								name="slug"
								disabled={!!article()?.slug}
								value={article()?.slug}
								error={() => submission.result?.errors?.slug}
							/>
							<Input
								label={t("title")}
								name="title"
								value={article()?.title}
								onInput={(e) => setTitle(e.currentTarget.value)}
								error={() => submission.result?.errors?.title}
							/>
							<Textarea
								label={t("description")}
								name="description"
								value={article()?.description}
								error={() => submission.result?.errors?.description}
								class="h-28 @lg:h-20"
							/>
							<Input
								label={t("keywords")}
								name="keywords"
								value={article()?.keywords ?? ""}
								error={() => submission.result?.errors?.keywords}
							/>
							<Select
								label={t("articleLang")}
								name="articleLang"
								error={() => submission.result?.errors?.articleLang}
								class="w-min"
							>
								<option
									selected={
										article()?.articleLang === "en" ||
										(!article()?.articleLang && params.lang === "en")
									}
								>
									en
								</option>
								<option
									selected={
										article()?.articleLang === "uk" ||
										(!article()?.articleLang && params.lang === "uk")
									}
								>
									uk
								</option>
							</Select>
						</details>
						<A
							activeClass=""
							class="absolute right-0 my-1 font-heading [grid-area:mode] @xl:hidden"
							href={getSearchParams("mode", oppositeMode())}
						>
							{t(oppositeMode())}
						</A>
						<div class="flex w-full gap-2 [grid-area:buttons] @xl:absolute @xl:right-0 @xl:w-min">
							<A
								activeClass=""
								class="my-1 hidden font-heading @xl:block"
								href={getSearchParams("mode", oppositeMode())}
							>
								{t(oppositeMode())}
							</A>
							<button type="submit" name="isActive" value="true">
								{t("publish")}
							</button>
							<button type="submit" class="btn--primary w-full">
								{t("save")}
							</button>
						</div>
						<input name="html" value={html()} hidden />
						<Textarea
							name="source"
							value={mdx()}
							class="resize-none overflow-x-scroll whitespace-pre font-mono"
							labelClass={cx(
								"[grid-area:editor]",
								location.query.mode === "history" && "hidden",
							)}
							onInput={(e) => setMdx(e.currentTarget.value)}
							error={() => submission.result?.errors?.source}
						/>
						<Show when={location.query.mode === "history"}>
							<VersionSelector />
						</Show>
					</form>
				</div>
				<article
					class="prose w-full overflow-y-auto text-wrap break-words p-2 lg:h-[calc(var(--vh)_-_theme('spacing.header-height')_-_2_*_theme('spacing.sides-padding'))] lg:w-[50%]"
					innerHTML={html()}
				/>
			</div>
		</>
	);
}

function VersionSelector() {
	const params = useParams<{
		lang: Lang;
		section: Section;
		slug: string;
	}>();
	const versions = createAsync(() =>
		getArticleVersions(params.lang, params.section, params.slug),
	);
	const { t } = useTranslation("admin");
	const unpublishArticle = useAction(unpublish);
	return (
		<ul class="list-none [grid-area:editor]">
			<For each={versions()}>
				{(version) => (
					<li class="flex min-h-8 items-center justify-between gap-1">
						<a
							href={`/${params.lang}/${params.section}/${
								params.slug
							}/edit${getSearchParams("createdAt", version.createdAt)}`}
							class="flex items-center justify-between gap-1"
						>
							<span>{version.title},</span>
							<span>{version.modifiedBy},</span>
							<span>
								{new Date(version.createdAt).toLocaleString(params.lang, {
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</a>
						<Show when={version.isActive}>
							<button
								type="button"
								class="btn--danger"
								onClick={() =>
									unpublishArticle(params.lang, params.section, params.slug)
								}
							>
								{t("deactivate")}
							</button>
						</Show>
					</li>
				)}
			</For>
		</ul>
	);
}
