import { langLink } from "~/shared/lang";
import { useTranslation } from "~/shared/useTranslation";

export function Logo() {
	const { t, lang } = useTranslation("common");
	return (
		<a
			href={langLink(lang())}
			hreflang={lang()}
			class="font-heading text-2xl/4"
		>
			{t("FPM")}
		</a>
	);
}
