import { Polyfill } from "~/shared/types";

export const existingSections = [
	"about",
	"admission",
	"study",
	"deanery",
	"information",
] as const;

export const supportedLngs = ["en", "uk"] as const;

export const breakpoints = {
	sm: 480,
	md: 768,
	lg: 1024,
};

export const mediaQueries = {
	sm: `(max-width: ${breakpoints.sm}px)`,
	md: `(min-width: ${breakpoints.sm + 1}px) and (max-width: ${
		breakpoints.md
	}px)`,
	lg: `(min-width: ${breakpoints.md + 1}px) and (max-width: ${
		breakpoints.lg
	}px)`,
	xlg: `(min-width: ${breakpoints.lg + 1}px)`,
};

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
		assets: [
			{ path: "/polyfills/popover.js", type: "script" },
			{ path: "/polyfills/popover.css", type: "stylesheet" },
		],
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
		assets: [
			{ path: "/polyfills/dialog.js", type: "script" },
			{ path: "/polyfills/dialog.css", type: "stylesheet" },
		],
	},
];
