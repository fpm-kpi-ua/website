import { Lang } from "~/shared/types";

export const getOppositeLanguage = (lang: Lang): Lang =>
	lang === "en" ? "uk" : "en";
export const parseLang = (lang?: string) => (lang === "en" ? "en" : "uk");

export const langLink = (lang: string | undefined, path?: string) => {
	const parsedLang = parseLang(lang);
	const parsedPath = path ?? "";

	const slash = parsedPath ? (parsedPath.startsWith("/") ? "" : "/") : "";

	if (["", "/"].includes(parsedPath) && parsedLang === "uk") return "/";
	return `/${parsedLang}${slash}${parsedPath}`;
};
