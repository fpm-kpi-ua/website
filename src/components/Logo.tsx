import { useAppState } from "~/app-context";
import { langLink } from "~/shared/lang";

export function Logo() {
	const { t, lang } = useAppState();
	return (
		<a
			href={langLink(lang)}
			hreflang={lang}
			class="font-heading text-primary text-2xl/4 font-bold hover:underline"
		>
			{t("home.meta.title")}
		</a>
	);
}
