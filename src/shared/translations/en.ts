import { BaseDict } from "@solid-primitives/i18n";

export const dict = {
	home: {
		meta: {
			title: "FAM",
			description:
				"The main page of the website of the Faculty of Applied Mathematics",
		},
		main: {
			h1: "Faculty of Applied Mathematics",
			p: "Do you want to know why our faculty is what you need?",
			more: "Read",
		},
		specialities: {
			h2: "Specialities",
			113: {
				title: "113 — Applied Mathematics",
				description:
					"Educational program: “Data Science and Mathematical Modeling”",
			},
			121: {
				title: "121 — Software Engineering",
				description:
					"Educational program: “Software engineering of multimedia and information search systems”",
			},
			123: {
				title: "123 — Computer engineering",
				description:
					"Educational program: “System programming and specialized computer systems”",
			},
			more: "More details",
		},
		news: {
			h2: "News",
			more: "Read more",
		},
	},
} satisfies BaseDict;
