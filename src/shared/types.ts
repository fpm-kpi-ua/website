import type { existingSections } from "~/shared/constants";

export type Lang = "en" | "uk";
export type Section = (typeof existingSections)[number];
export interface ArticleCard {
	title: string;
	description: string;
	link: string;
	draft: boolean;
}
