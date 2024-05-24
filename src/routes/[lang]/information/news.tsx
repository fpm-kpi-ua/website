import {
	A,
	type RouteLoadFuncArgs,
	type RouteSectionProps,
	cache,
	createAsync,
} from "@solidjs/router";
import { desc, eq } from "drizzle-orm";
import { For } from "solid-js";
import { db } from "~/drizzle/db";
import { news } from "~/drizzle/schema";
import { parseLang } from "~/shared/lang";
import type { Lang } from "~/shared/types";
import { useTranslation } from "~/shared/use-translation";

// TODO: Add pagination, create / edit / delete news

const getNews = cache(async (lang: Lang) => {
	"use server";

	return db
		.select({
			id: news.id,
			title: news.title,
			html: news.html,
			createdAt: news.createdAt,
		})
		.from(news)
		.where(eq(news.lang, lang))
		.orderBy(desc(news.createdAt))
		.all();
}, "news");

export const route = {
	load: ({ params }: RouteLoadFuncArgs) => {
		getNews(parseLang(params.lang));
	},
};

export default function News({ location }: RouteSectionProps) {
	const { t, lang } = useTranslation();
	const news = createAsync(() => getNews(lang()));

	return (
		<div class="mx-auto max-w-max-page-width">
			<h1>{t("news")}</h1>
			<ul>
				<For each={news()}>
					{(n, i) => (
						<>
							<li class="mt-8">
								<article>
									<h2 id={`news-${n.id}`}>
										<A href={`${location.search}#news-${n.id}`}>{n.title}</A>
									</h2>
									<time dateTime={new Date(n.createdAt).toISOString()}>
										{new Date(n.createdAt).toLocaleDateString()}
									</time>
									<div class="prose max-w-max-page-width" innerHTML={n.html} />
								</article>
							</li>
							{i() < (news()?.length ?? 0) - 1 && <hr />}
						</>
					)}
				</For>
			</ul>
		</div>
	);
}
