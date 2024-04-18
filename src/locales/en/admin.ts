import type dictType from "~/locales/uk/admin";

export default {
	users: "Users",
	edit: "Edit",
	save: "Save",
	publish: "Publish",
	cancel: "Cancel",
	delete: "Delete",
	preview: "Preview",
	submit: "Submit",
	title: "Title",
	slug: "Slug",
	description: "Description",
	keywords: "Keywords",
	articleLang: "Language of article's content",
	draft: "Draft",
	newsSaved: "An updated version of the news was successfully saved!",
	deleteArticle: "Delete article",
	confirmDeleteArticle:
		'Are you sure that you want to delete "{{title}}" article?',
	deleteNews: "Delete news",
	confirmDeleteNews: 'Are you sure that you want to delete "{{title}}" news?',
} satisfies typeof dictType;
