import { useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import { cx } from "~/shared/cx";
import { langLink } from "~/shared/lang";
import { useTranslation } from "~/shared/use-translation";

export function LanguageSwitcher(props: {
	class?: string;
}) {
	const { lang } = useTranslation();
	const location = useLocation();
	const pathname = createMemo(() => location.pathname);
	const search = createMemo(() => location.search);
	const pathnameWithoutLang = () => pathname().replace(/^\/(en|uk)/, "");
	const ukLink = () => langLink("uk", pathnameWithoutLang()) + search();
	const enLink = () => langLink("en", pathnameWithoutLang()) + search();

	return (
		<span class={cx("flex items-center font-heading lg:m-0", props.class)}>
			<a
				class={cx(
					"mr-1 leading-4",
					lang() === "uk" ? "text-primary" : "text-text",
				)}
				href={ukLink()}
				lang="uk"
				hreflang="uk"
				aria-label="Посилання на українську версію сайту"
			>
				Укр
			</a>
			<a
				class={cx(
					"ml-1 leading-4",
					lang() === "en" ? "text-primary" : "text-text",
				)}
				href={enLink()}
				lang="en"
				hreflang="en"
				aria-label="Link to english version of the site"
			>
				Eng
			</a>
		</span>
	);
}
