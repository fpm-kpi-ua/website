import { action, cache, json, redirect } from "@solidjs/router";
import { desc, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-valibot";
import { getRequestEvent } from "solid-js/web";
import * as v from "valibot";
import { db } from "~/drizzle/db";
import { t_news } from "~/drizzle/schema";
import type { Lang } from "./types";
import "@valibot/i18n/uk";
import { formatValidationErrors } from "./format-validation-errors";

const schema = v.omit(
	createInsertSchema(t_news, { id: v.optional(v.number()) }),
	["createdAt"],
);

export const getNewsPreview = cache(async (lang: Lang) => {
	"use server";
	return db
		.select({
			id: t_news.id,
			title: t_news.title,
			preview: t_news.preview,
			createdAt: t_news.createdAt,
		})
		.from(t_news)
		.where(eq(t_news.lang, lang))
		.orderBy(desc(t_news.createdAt))
		.limit(3)
		.all();
}, "news-preview");

export const getNews = cache(async (lang: Lang) => {
	"use server";
	return db
		.select({
			id: t_news.id,
			title: t_news.title,
			html: t_news.html,
			createdAt: t_news.createdAt,
		})
		.from(t_news)
		.where(eq(t_news.lang, lang))
		.orderBy(desc(t_news.createdAt))
		.all();
}, "news");

export const getEditNews = cache(async (id: number) => {
	"use server";
	return db.select().from(t_news).where(eq(t_news.id, id)).get();
}, "edit-news");

export const saveNews = action(async (data: FormData) => {
	"use server";
	const referrer = getRequestEvent()?.request.headers.get("referer");
	if (!referrer) return;
	const url = new URL(referrer);
	const [, lang, , , id] = url.pathname.split("/");
	const input = Object.assign(
		+id ? { id: +id, lang } : { lang },
		Object.fromEntries(data),
	);
	const res = v.safeParse(schema, input, { lang });

	if (!res.success) {
		return formatValidationErrors(res.issues);
	}
	const news = res.output;
	const newsExists = news.id
		? db.select().from(t_news).where(eq(t_news.id, news.id)).all().length > 0
		: false;
	console.log(newsExists);
	if (news.id && newsExists) {
		db.update(t_news).set(news).where(eq(t_news.id, news.id)).run();
	} else {
		const { id, ...newsWithoutId } = news;
		const { lastInsertRowid } = db.insert(t_news).values(newsWithoutId).run();
		console.log(lastInsertRowid);
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
	const referrer = getRequestEvent()?.request.headers.get("referer");
	if (!referrer) return;
	const url = new URL(referrer);
	const lang = url.pathname.split("/")[1];
	console.log(lang, id);
	db.delete(t_news).where(eq(t_news.id, id)).run();
	return redirect(`/${lang}/information/news`, {
		headers: {
			revalidate: "news,edit-news",
		},
	});
});
