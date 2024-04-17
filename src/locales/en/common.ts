import type dictType from "~/locales/uk/common";

export default {
	FPM: "FAM",
	signIn: "Sign In",
	signUp: "Sign Up",
	signOut: "Sign Out",
	emptySection: "There are no articles in this category yet.",
	articleOfDifferentLang: "This article has only a Ukrainian version",
	search: "Search",
	goBack: "Go back",
	news: "News",
	sectionDescription: 'Section containing articles about topic: "{{section}}"',
	menu: {
		summary: "Menu",
		theme: {
			light: "Light",
			auto: "Auto",
			dark: "Dark",
		},
		changeColor: "change primary color",
	},
	validation: {
		slug: "Only english lower case letters and hyphen allowed.",
		required: "The field is required.",
		email: "The field must be valid email.",
		min: "The field must contain at least {{value}} characters.",
		max: "The field can't contain more than {{value}} characters.",
	},
	header: {
		about: "About faculty",
		admission: "Admission",
		study: "Study",
		deanery: "Dean's office",
		information: "Information",
	},
	footer: {
		contacts: "Contacts",
		curators: "Curators 2021-2022",
		"dean'sReport": "Dean's report",
		codeOfHonor: "The Code of Honor of «Igor Sikorsky KPI»",
		surveyOfGraduates: "Survey of graduates 121",
		surveyOfWorkers: "Survey of scientific and pedagogical workers 121",
		telegram: "Link to our telegram channel",
		facebook: "Link to our facebook",
	},
	errors: {
		403: {
			title: "Forbidden",
			description: "Sorry, you are not authorized to access this page.",
		},
		404: {
			title: "Not Found",
			description: "Sorry, the page you visited does not exist.",
		},
		critical: {
			title: "Critical error",
			description: "A critical error has occurred.",
		},
		backPrevious: "Back to previous screen",
		backHome: "Back to home page",
	},
	aria: {
		logo: "Link to the homepage",
		login: "Link to the login page",
		theme: "Button to switch the theme",
		ukLang: "Ukrainian language",
		enLang: "English language",
		toggleMenu: "Toggle menu button",
	},
} satisfies typeof dictType;
