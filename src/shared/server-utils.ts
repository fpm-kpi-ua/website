"use server";

import { getRequestEvent } from "solid-js/web";
import { parseLang } from "~/shared/lang";

export function getLang() {
	const url = getRequestEvent()?.request.url;
	if (!url) return "uk";
	return parseLang(new URL(url).pathname?.split("/")[1]);
}
