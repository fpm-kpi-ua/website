import { useTranslation } from "~/shared/use-translation";

export default function NotFound() {
	const { t } = useTranslation();

	return (
		<>
			<h1 class="mt-8 font-heading text-6xl">{t("errors.404.title")}</h1>
			<p class="mt-8">{t("errors.404.description")}</p>
		</>
	);
}
