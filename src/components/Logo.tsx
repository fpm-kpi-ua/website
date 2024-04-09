import { cx } from "~/shared/cx";
import { langLink } from "~/shared/lang";
import { useTranslation } from "~/shared/useTranslation";

export function Logo(props: { class?: string }) {
	const { t, lang } = useTranslation("common");
	return (
		<a
			href={langLink(lang())}
			class={cx(
				"highlight-tap select-none font-heading text-2xl/5",
				props.class,
			)}
		>
			{t("FPM")}
		</a>
	);
}
