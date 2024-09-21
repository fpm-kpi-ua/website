import { action, cache, json, redirect } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { getRequestEvent } from "solid-js/web";
import { db } from "~/drizzle/db";
import { p_getNewsList, p_getNewsPreview } from "~/drizzle/prepared-queries";
import { t_news } from "~/drizzle/schema";
import { checkAccessRights } from "~/shared/check-access-rights.server";
import { insertNewsSchema } from "~/shared/schemas";
import type { Lang } from "~/shared/types";
import { validate } from "~/shared/validate.server";
import { getLang } from "./server-utils";

export const getNewsPreview = cache(async (lang: Lang) => {
	"use server";
	return p_getNewsPreview.all({ lang, limit: 3 });
}, "news-preview");

export const getNews = cache(async (lang: Lang) => {
	"use server";
	return p_getNewsList.all({ lang });
}, "news");

export const getEditNews = cache(async (id: number) => {
	"use server";
	await checkAccessRights("content-manager");
	return db.select().from(t_news).where(eq(t_news.id, id)).get();
}, "edit-news");

export const saveNews = action(async (data: FormData) => {
	"use server";
	await checkAccessRights("content-manager");
	const url = new URL(getRequestEvent()?.request.url ?? "");
	const [, lang, , , id] = url.pathname.split("/");
	const input = Object.assign(
		+id ? { id: +id, lang } : { lang },
		Object.fromEntries(data),
	);
	const news = await validate(insertNewsSchema, input, lang as Lang);
	const newsExists = news.id
		? db.select().from(t_news).where(eq(t_news.id, news.id)).all().length > 0
		: false;

	if (news.id && newsExists) {
		db.update(t_news).set(news).where(eq(t_news.id, news.id)).run();
	} else {
		const { id, ...newsWithoutId } = news;
		const { lastInsertRowid } = db.insert(t_news).values(newsWithoutId).run();
		return redirect(`/${lang}/information/news/${lastInsertRowid}/edit`, {
			headers: {
				revalidate: "news,edit-news",
			},
		});
	}
	return json({} as Record<string, Record<string, string>>, {
		headers: {
			revalidate: "news,edit-news",
		},
	});
});

export const deleteNews = action(async (id: number) => {
	"use server";
	await checkAccessRights("content-manager");
	const lang = getLang();
	db.delete(t_news).where(eq(t_news.id, id)).run();
	return redirect(`/${lang}/information/news`, {
		headers: {
			revalidate: "news,edit-news",
		},
	});
});
