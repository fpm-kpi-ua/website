import { Meta, Title } from "@solidjs/meta";
import { type RouteLoadFuncArgs, cache, createAsync } from "@solidjs/router";
import { desc, eq } from "drizzle-orm";
import { For } from "solid-js";
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
	load: ({ location }: RouteLoadFuncArgs) =>
		getTranslations(parseLang(location.pathname.split("/")[1]), "home"),
};

const getNews = cache(async (lang: Lang, offset: number, limit: number) => {
	"use server";
	return (
		await db
			.select()
			.from(news)
			.where(eq(news.lang, lang))
			.orderBy(desc(news.createdAt))
			.offset(offset)
			.limit(limit)
	).map((n) => {
		n.source =
			n.source.length > 200 ? `${n.source.slice(0, 200)}...` : n.source;
		return n;
	});
}, "news");

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
							class="button button--primary mt-4 lg:mt-16"
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
						<article class="card relative m-0 grid h-full w-full overflow-hidden rounded bg-background-secondary p-6 shadow transition">
							<span
								class="mx-auto mt-0 mb-4 font-pi font-semibold text-5xl text-primary leading-none"
								aria-hidden
							>
								π
							</span>
							<h3 class="text-center">
								<a
									href={langLink(
										lang(),
										"/about/specialities#spetsialnist-113-prykladna-matematyka",
									)}
									class="tap-transparent text-balance text-lg text-primary before:absolute before:inset-0 before:rounded hover:no-underline focus-visible:outline-none before:content-['']"
								>
									{t("specialities.113.title")}
								</a>
							</h3>
							<p class="mx-0 mt-2 text-balance text-center">
								{t("specialities.113.description")}
							</p>
						</article>

						<article class="card relative m-0 grid h-full w-full overflow-hidden rounded bg-background-secondary p-6 shadow transition">
							<span
								class="mx-auto mt-0 mb-4 font-semibold text-4xl text-primary"
								aria-hidden
							>
								{"{ }"}
							</span>
							<h3 class="text-center">
								<a
									href={langLink(
										lang(),
										"/about/specialities#spetsialnist-121-inzheneriia-prohramnoho-zabezpechennia",
									)}
									class="tap-transparent text-balance text-lg text-primary before:absolute before:inset-0 before:rounded hover:no-underline focus-visible:outline-none before:content-['']"
								>
									{t("specialities.121.title")}
								</a>
							</h3>
							<p class="mx-0 mt-2 text-balance text-center">
								{t("specialities.121.description")}
							</p>
						</article>

						<article class="card relative m-0 grid h-full w-full overflow-hidden rounded bg-background-secondary p-6 shadow transition">
							<span class="mx-auto mt-0 mb-4 font-semibold text-4xl text-primary">
								<ProcessorIcon />
							</span>
							<h3 class="text-center">
								<a
									href={langLink(
										lang(),
										"/about/specialities#spetsialnist-123-kompiuterna-inzheneriia",
									)}
									class="tap-transparent text-balance text-lg text-primary before:absolute before:inset-0 before:rounded hover:no-underline focus-visible:outline-none before:content-['']"
								>
									{t("specialities.123.title")}
								</a>
							</h3>
							<p class="mx-0 mt-2 text-balance text-center">
								{t("specialities.123.description")}
							</p>
						</article>
					</div>
					<a
						class="button mx-auto w-fit"
						href={langLink(lang(), "about/specialities")}
					>
						{t("specialities.more")}
					</a>
				</section>
				<section class="news-areas grid gap-4 md:gap-x-24 md:gap-y-4">
					<h2 class="title-area text-center text-primary">{t("news.h2")}</h2>
					<div class="news-area grid gap-y-4">
						<For each={news()}>
							{(n) => (
								<article class="card relative m-0 h-min w-full overflow-hidden rounded bg-background-secondary p-6 shadow transition">
									<h3 class="m-0 text-lg">
										<a
											href={langLink(n.lang, `information/news/${n.id}`)}
											class="card__link tap-transparent text-text before:absolute before:inset-0 before:rounded-lg hover:opacity-100 focus-visible:outline-none before:content-['']"
										>
											{n.title}
										</a>
									</h3>
									<p class="mx-0 mt-2">{n.source}</p>
								</article>
							)}
						</For>
					</div>

					<ThemedIcon
						path="person/8"
						class="icon-area h-60 self-end md:h-auto"
					/>
					<a
						href={langLink(lang(), "information/news")}
						class="button button--primary button-area self-end md:w-fit"
					>
						{t("news.more")}
					</a>
				</section>
			</div>
		</>
	);
}
