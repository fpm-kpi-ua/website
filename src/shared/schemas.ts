import {
	type InferOutput,
	minLength,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
	transform,
	trim,
	unknown,
} from "valibot";
import { existingSections, supportedLngs } from "./constants";

const optionalString = pipe(
	optional(string()),
	transform((v) => v ?? ""),
	trim(),
);

const castBoolean = pipe(
	unknown(),
	transform((v) => v === true || v === "true" || v === "on"),
);
const castNumber = pipe(unknown(), transform(Number), number());

export const insertArticleSchema = object({
	lang: picklist(supportedLngs),
	section: picklist(existingSections),
	slug: pipe(string(), trim(), minLength(3)),
	title: pipe(string(), trim(), minLength(3)),
	description: pipe(string(), trim(), minLength(10)),
	keywords: optionalString,
	isActive: castBoolean,
	articleLang: picklist(supportedLngs),
	source: optionalString,
	html: optionalString,
	modifiedBy: castNumber,
});
export type InsertArticle = InferOutput<typeof insertArticleSchema>;

export const insertNewsSchema = object({
	id: optional(castNumber),
	title: pipe(string(), trim(), minLength(3)),
	source: pipe(string(), trim(), minLength(3)),
	preview: pipe(string(), trim(), minLength(10)),
	html: pipe(string(), trim(), minLength(10)),
	lang: picklist(supportedLngs),
});
export type InsertNews = InferOutput<typeof insertNewsSchema>;
