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
				// text: "var(--text-color)",
				// secondary: "var(--secondary-color)",
				// background: "var(--background-color)",
				// "background-secondary": "var(--secondary-background-color)"
			},
		},
	},
	plugins: [],
} satisfies Config;
