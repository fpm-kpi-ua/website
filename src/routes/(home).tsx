import { Meta, Title } from "@solidjs/meta";
import { type RouteLoadFuncArgs, cache, createAsync } from "@solidjs/router";
import { desc, eq, sql } from "drizzle-orm";
import { For } from "solid-js";
import { ArticleCard, ArticleCardWithIcon } from "~/components/ArticleCard";
import { ProcessorIcon } from "~/components/Icons/ProcessorIcon";
import { ThemedIcon } from "~/components/ThemedIcon";
import { db } from "~/drizzle/db";
import { news } from "~/drizzle/schema";
import { breakpoints } from "~/shared/constants";
import { langLink, parseLang } from "~/shared/lang";
import type { Lang } from "~/shared/types";
import { getTranslations, useTranslation } from "~/shared/useTranslation";
import "./(home).css";

export const route = {
	load: ({ params }: RouteLoadFuncArgs) =>
		getTranslations(parseLang(params.lang), "home"),
};

const getNews = cache(async (lang: Lang, offset: number, limit: number) => {
	"use server";
	return db
		.select({
			id: news.id,
			title: news.title,
			source: sql<string>`substr(${news.source}, 1, 200) || '...'`,
		})
		.from(news)
		.where(eq(news.lang, lang))
		.orderBy(desc(news.createdAt))
		.offset(offset)
		.limit(limit)
		.all();
}, "news-preview");

export default function Home() {
	const { t, lang } = useTranslation("home");
	const news = createAsync(() => getNews(lang(), 0, 3));
	return (
		<>
			<Title>{t("meta.title")}</Title>
			<Meta name="description" content={t("meta.description")} />
			<Meta name="og:title" content={t("main.h1")} />
			<Meta name="og:description" content={t("main.p")} />
			<div class="mx-auto my-0 w-full max-w-max-page-width">
				<section class="mt-12 mb-8 grid min-h-[calc(var(--vh)_/_2)] grid-cols-1 items-center text-center duration-0 lg:min-h-[30rem] md:grid-cols-[2fr_1fr] md:text-start">
					<div class="md:-order-none order-2 self-start md:self-auto">
						<h1 class="text-primary">{t("main.h1")}</h1>
						<p class="mt-4 text-balance">{t("main.p")}</p>
						<a
							class="btn btn--primary mt-4 lg:mt-16"
							href={langLink(lang(), "about")}
						>
							{t("main.more")}
						</a>
					</div>
					<ThemedIcon
						path="person/1"
						mobileWidth={breakpoints.md}
						class="-translate-y-2 mb-4 flex h-28 scale-[1.3] justify-center md:h-60 md:scale-[1.2]"
					/>
				</section>
				<section class="mb-40 grid">
					<h2 class="text-center text-primary">{t("specialities.h2")}</h2>
					<div class="center-card-scale mx-0 my-8 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3">
						<ArticleCardWithIcon
							title={t("specialities.113.title")}
							description={t("specialities.113.description")}
							href={langLink(
								lang(),
								"/about/specialities#spetsialnist-113-prykladna-matematyka",
							)}
							icon={
								<span
									class="mx-auto mt-0 mb-4 font-pi font-semibold text-5xl text-primary leading-none"
									aria-hidden
								>
									π
								</span>
							}
						/>
						<ArticleCardWithIcon
							title={t("specialities.121.title")}
							description={t("specialities.121.description")}
							href={langLink(
								lang(),
								"/about/specialities#spetsialnist-121-inzheneriia-prohramnoho-zabezpechennia",
							)}
							icon={
								<span
									class="mx-auto mt-0 mb-4 font-semibold text-4xl text-primary"
									aria-hidden
								>
									{"{ }"}
								</span>
							}
						/>
						<ArticleCardWithIcon
							title={t("specialities.123.title")}
							description={t("specialities.123.description")}
							href={langLink(
								lang(),
								"/about/specialities#spetsialnist-123-kompiuterna-inzheneriia",
							)}
							icon={
								<span class="mx-auto mt-0 mb-4 font-semibold text-4xl text-primary">
									<ProcessorIcon />
								</span>
							}
						/>
					</div>
					<a
						class="btn mx-auto w-fit"
						href={langLink(lang(), "about/specialities")}
					>
						{t("specialities.more")}
					</a>
				</section>
				<section class="news-areas grid gap-4 md:gap-x-24 md:gap-y-4">
					<h2 class="text-center text-primary [grid-area:title]">
						{t("news.h2")}
					</h2>
					<div class="grid gap-y-4 [grid-area:news]">
						<For each={news()}>
							{(n) => (
								<ArticleCard
									title={n.title}
									description={n.source}
									href={langLink(lang(), `information/news/${n.id}`)}
								/>
							)}
						</For>
					</div>

					<ThemedIcon
						path="person/8"
						class="max-h-60 self-end [grid-area:icon] md:max-h-fit"
					/>
					<a
						href={langLink(lang(), "information/news")}
						class="btn btn--primary self-end [grid-area:button] md:w-fit"
					>
						{t("news.more")}
					</a>
				</section>
			</div>
		</>
	);
}
