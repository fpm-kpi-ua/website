import UaParser from "ua-parser-js";
import type { Polyfill } from "./types";

const parser = new UaParser();

export function getPolyfills(ua: string) {
	parser.setUA(ua);
	const browser = parser.getBrowser();

	return polyfills.reduce((acc, polyfill) => {
		if (!browser || !browser.name || !browser.version)
			return acc.concat(polyfill.assets);
		if (
			polyfill.browsers[browser.name] &&
			browserVersionToNumber(browser.version) >=
				polyfill.browsers[browser.name]!
		)
			return acc;
		return acc.concat(polyfill.assets);
	}, [] as string[]);
}

function browserVersionToNumber(version: string) {
	const [major, minor = 0] = version.split(".");
	return Number(`${major}.${minor}`);
}

export const polyfills: Polyfill[] = [
	{
		browsers: {
			Safari: 17,
			"Mobile Safari": 17,
			"Chrome WebView": 114,
			Chrome: 114,
			Chromium: 114,
			Edge: 114,
			"Android Browser": 114,
		},
		assets: ["/polyfills/popover.js", "/polyfills/popover.css"],
	},
	{
		browsers: {
			Safari: 15.4,
			"Mobile Safari": 15.4,
			"Chrome WebView": 37,
			Chrome: 37,
			Chromium: 37,
			Edge: 79,
			"Android Browser": 37,
			Opera: 24,
			"Opera Mini": 24,
			"Opera Mobile": 24,
			Firefox: 98,
			"Mobile Firefox": 98,
			"Samsung Browser": 3.0,
			UCBrowser: 15.5,
			"QQ Browser": 13.1,
			Baidu: 13.18,
		},
		assets: ["/polyfills/dialog.js", "/polyfills/dialog.css"],
	},
];
