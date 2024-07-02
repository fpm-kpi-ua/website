import { action, useSubmission } from "@solidjs/router";
import { verify } from "argon2";
import { eq } from "drizzle-orm";
import { createEffect } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import { Input } from "~/components/input";
import { db } from "~/drizzle/db";
import { t_users } from "~/drizzle/schema";
import { parseLang } from "~/shared/lang";
import { loginSchema } from "~/shared/schemas";
import { getUserSession } from "~/shared/session";
import { getTranslations, useTranslation } from "~/shared/use-translation";
import { validate } from "~/shared/validate.server";

const login = action(async (data: FormData) => {
	"use server";
	const referrer = getRequestEvent()?.request.headers.get("referer");
	if (!referrer) return { success: false };
	const url = new URL(referrer);
	const lang = parseLang(url.pathname.split("/")[1]);

	const { email, password } = await validate(loginSchema, data, lang);
	const locales = await getTranslations(lang, "common");

	const user = db.select().from(t_users).where(eq(t_users.email, email)).get();

	const invalidEmailOrPass = {
		validation: {
			email: locales["auth.invalidEmailOrPass"],
			password: locales["auth.invalidEmailOrPass"],
		},
	};
	if (!user) throw invalidEmailOrPass;
	const isValid = await verify(user.password, password + user.salt);
	if (!isValid) throw invalidEmailOrPass;

	return { success: true };
});

export function LoginModal() {
	const { t } = useTranslation();
	const submission = useSubmission(login);

	createEffect(() => {
		if (submission.result) {
			document.getElementById("login-form-modal")?.hidePopover();
		}
	});

	return (
		<>
			<button type="button" popovertarget="login-form-modal">
				{t("auth.login")}
			</button>
			<div
				popover
				id="login-form-modal"
				class="w-full max-w-lg rounded bg-background-secondary p-4 text-text shadow"
			>
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
			</div>
		</>
	);
}
