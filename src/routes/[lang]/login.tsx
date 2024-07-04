import { Title } from "@solidjs/meta";
import { LoginForm } from "~/components/login-form";
import { useTranslation } from "~/shared/use-translation";

export default function LoginPage() {
	const { t } = useTranslation();
	return (
		<div class="mx-auto max-w-max-page-width">
			<Title>{t("auth.login")}</Title>
			<LoginForm />
		</div>
	);
}
