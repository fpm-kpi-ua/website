import { Title } from "@solidjs/meta";
import { RegisterForm } from "~/components/register-form";
import { useTranslation } from "~/shared/use-translation";

export default function RegisterPage() {
	const { t } = useTranslation();
	return (
		<div class="mx-auto max-w-max-page-width">
			<Title>{t("auth.register")}</Title>
			<RegisterForm />
		</div>
	);
}
