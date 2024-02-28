import { Config } from "tailwindcss";


export default {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	theme: {
		extend: {
			margin:{
				header: "var(--header-height)"
			},
			height:{
				header: "var(--header-height)"
				},
			colors:{
				primary: "rgb(var(--primary-color) / <alpha-value>)",
				background: "rgb(var(--background-color) / <alpha-value>)",
				"background-secondary": "rgb(var(--secondary-background-color) / <alpha-value>)",
				text: "var(--text-color)",
				// secondary: "var(--secondary-color)",
				// background: "var(--background-color)",
				// "background-secondary": "var(--secondary-background-color)"
			},
		}
	},
	plugins: []
} satisfies Config;