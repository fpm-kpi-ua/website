import {
	A,
	type RouteLoadFuncArgs,
	type RouteSectionProps,
	createAsync,
} from "@solidjs/router";
import { For } from "solid-js";
import { parseLang } from "~/shared/lang";
import { getNews } from "~/shared/news.server";
import { useTranslation } from "~/shared/use-translation";

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
										{new Date(n.createdAt).toLocaleDateString(lang())}
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
