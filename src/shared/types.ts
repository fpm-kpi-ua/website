import { type existingSections } from "~/shared/constants";

export type Lang = "en" | "uk";
export type Section = (typeof existingSections)[number];
export interface IArticleCard {
	title: string;
	description: string;
	link: string;
	draft: boolean;
}

export interface PolyfillAsset {
	type: "script" | "stylesheet";
	path: string;
}

export interface Polyfill {
	/** min version of browser in which feature is supported, and polyfill shouldn't be loaded */
	browsers: Record<string, number>;
	assets: PolyfillAsset[];
}
