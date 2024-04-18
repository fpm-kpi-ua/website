import containerQueries from "@tailwindcss/container-queries";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{ts,tsx}"],
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		screens: {
			sm: "481px",
			md: "769px",
			lg: "1025px",
			xl: "1441px",
			"max-578": { max: "578px" },
		},
		fontFamily: {
			heading: ["DaysOne", "sans-serif"],
			pi: ["Pi", "sans-serif"],
			mono: [
				"ui-monospace",
				"SFMono-Regular",
				"Menlo",
				"Monaco",
				"Consolas",
				"Liberation Mono",
				"Courier New",
				"monospace",
			],
		},
		extend: {
			boxShadow: {
				DEFAULT: "0 2px 10px rgba(3 82 86 / 0.5)",
			},
			borderRadius: {
				DEFAULT: "0.4rem",
			},
			spacing: {
				"header-height": "4rem",
				"sides-padding": "1rem",
				"max-page-width": "50rem",
			},
			colors: {
				primary: "rgb(var(--primary-color) / <alpha-value>)",
				background: "rgb(var(--background-color) / <alpha-value>)",
				"background-secondary":
					"rgb(var(--secondary-background-color) / <alpha-value>)",
				text: "rgb(var(--text-color) / <alpha-value>)",
				error: "rgb(var(--error-color) / <alpha-value>)",
			},
			// biome-ignore lint/suspicious/noExplicitAny: have no idea how to fix it
			typography: (theme: any) => ({
				DEFAULT: {
					css: {
						"--tw-prose-body": theme("colors.text"),
						"--tw-prose-links": "rgb(var(--primary-color))",
						"--tw-prose-headings": "rgb(var(--primary-color))",
						"--tw-prose-bold": "rgb(var(--text-color))",
						"--tw-prose-bullets": "var(--gray-color)",
						"--tw-prose-th-borders": "var(--gray-color)",
						a: {
							fontWeight: "inherit",
							textDecoration: "none",
						},
						"thead th": {
							color: "var(--tw-prose-bold)",
							fontWeight: "600",
							verticalAlign: "bottom",
						},
					},
				},
			}),
		},
	},
	plugins: [typography, containerQueries],
} satisfies Config;
