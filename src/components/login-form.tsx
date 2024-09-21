import { action, redirect, useSubmission } from "@solidjs/router";
import { verify } from "argon2";
import { createEffect } from "solid-js";
import { Input } from "~/components/input";
import { p_getUserByEmail } from "~/drizzle/prepared-queries";
import { checkAccessRights } from "~/shared/check-access-rights.server";
import { langLink } from "~/shared/lang";
import { loginSchema } from "~/shared/schemas";
import { getLang } from "~/shared/server-utils";
import { getUserSession, revalidateSession } from "~/shared/session.server";
import {
	getServerTranslations,
	useTranslation,
} from "~/shared/use-translation";
import { validate } from "~/shared/validate.server";

const login = action(async (data: FormData) => {
	"use server";
	await checkAccessRights("unauthorized");
	const session = await getUserSession();
	const lang = getLang();
	const { email, password } = await validate(loginSchema, data, lang);
	const locales = await getServerTranslations(lang, "common");

	const user = p_getUserByEmail.get({ email });

	const invalidEmailOrPass = {
		validation: {
			email: locales["auth.invalidEmailOrPass"],
			password: locales["auth.invalidEmailOrPass"],
		},
	};
	if (!user) throw invalidEmailOrPass;
	const isValid = await verify(user.password, password + user.salt);
	if (!isValid) throw invalidEmailOrPass;
	if (!user.isActive)
		throw { validation: { email: locales["auth.accountNotActive"] } };
	await revalidateSession(session, user.id);
	return redirect(langLink(lang));
});

export function LoginForm() {
	const { t } = useTranslation();
	const submission = useSubmission(login);

	createEffect(() => {
		if (submission.result) {
			document.getElementById("login-form-modal")?.hidePopover();
		}
	});

	return (
		<form method="post" action={login} class="grid gap-2">
			<Input
				name="email"
				type="email"
				label={t("auth.email")}
				error={() => submission.error?.validation?.email}
			/>
			<Input
				name="password"
				type="password"
				label={t("auth.password")}
				error={() => submission.error?.validation?.password}
			/>
			<button type="submit" class="btn--primary">
				{t("auth.login")}
			</button>
		</form>
	);
}
