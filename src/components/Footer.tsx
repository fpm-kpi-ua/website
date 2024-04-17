import { FacebookIcon } from "~/components/Icons/FacebookIcon";
import { TelegramIcon } from "~/components/Icons/TelegramIcon";
import { Logo } from "~/components/Logo";
import { langLink } from "~/shared/lang";
import { useTranslation } from "~/shared/useTranslation";
import "./Footer.css";

export const Footer = () => {
	const { t, lang } = useTranslation();

	return (
		<footer class="bg-primary px-sides-padding py-8">
			<div class="footer__content mx-auto grid max-w-max-page-width gap-12">
				<Logo class="[grid-area:logo]" />
				<div class="grid gap-4 [grid-area:links-1]">
					<a href={langLink(lang(), "admission/contacts")}>
						{t("footer.contacts")}
					</a>
					<a href={langLink(lang(), "404")}>{t("footer.dean'sReport")}</a>
					<a
						href="/files/Opituvannya_NPP_121.pdf"
						target="_blank"
						rel="noreferrer"
					>
						{t("footer.surveyOfWorkers")}
					</a>
				</div>
				<div class="grid gap-4 [grid-area:links-2]">
					<a
						href="/files/Opituvannya_aspirantiv_121.pdf"
						target="_blank"
						rel="noreferrer"
					>
						{t("footer.surveyOfGraduates")}
					</a>
					<a href="/files/Kuratory_21-22.pdf" target="_blank" rel="noreferrer">
						{t("footer.curators")}
					</a>
					<a
						href={
							lang() === "en" ? "https://kpi.ua/en/code" : "https://kpi.ua/code"
						}
						target="_blank"
						rel="noreferrer"
					>
						{t("footer.codeOfHonor")}
					</a>
				</div>
				<div class="flex gap-x-4 justify-self-end [grid-area:social]">
					<a
						href="https://t.me/dekanat_fpm"
						target="_blank"
						aria-label={t("footer.telegram")}
						rel="noreferrer"
					>
						<TelegramIcon class="size-12" />
					</a>
					<a
						href="https://www.facebook.com/groups/fpm.kpi/"
						target="_blank"
						aria-label={t("footer.facebook")}
						rel="noreferrer"
					>
						<FacebookIcon class="size-12" />
					</a>
				</div>
			</div>
		</footer>
	);
};
