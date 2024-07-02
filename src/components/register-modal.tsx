import { action, useSubmission } from "@solidjs/router";
import { hash } from "argon2";
import { eq } from "drizzle-orm";
import { Show, createEffect, createSignal } from "solid-js";
import { For, getRequestEvent } from "solid-js/web";
import { Input } from "~/components/input";
import { Select } from "~/components/select";
import { db } from "~/drizzle/db";
import {
	t_admins,
	t_contentManagers,
	t_students,
	t_teachers,
	t_users,
} from "~/drizzle/schema";
import { existingRoles } from "~/shared/constants";
import { parseLang } from "~/shared/lang";
import { insertUserSchema } from "~/shared/schemas";
import { getTranslations, useTranslation } from "~/shared/use-translation";
import { validate } from "~/shared/validate.server";

const register = action(async (data: FormData) => {
	"use server";

	const referrer = getRequestEvent()?.request.headers.get("referer");
	if (!referrer) return { success: false };
	const url = new URL(referrer);
	const lang = parseLang(url.pathname.split("/")[1]);

	const insertUser = await validate(insertUserSchema, data, lang);
	const locales = await getTranslations(lang, "common");

	const alreadyExists = db
		.select()
		.from(t_users)
		.where(eq(t_users.email, insertUser.email))
		.get();
	if (alreadyExists)
		throw { validation: { email: locales["auth.userAlreadyExists"] } };
	const salt = Math.random().toString(36).slice(2);
	const hashedPass = await hash(insertUser.password + salt);
	const user = db
		.insert(t_users)
		.values({ ...insertUser, password: hashedPass, salt })
		.returning()
		.get();

	switch (insertUser.role) {
		case "admin":
			db.insert(t_admins).values({ userId: user.id }).run();
			break;
		case "content-manager":
			db.insert(t_contentManagers).values({ userId: user.id }).run();
			break;
		case "teacher":
			db.insert(t_teachers).values({ userId: user.id }).run();
			break;
		case "student":
			db.insert(t_students)
				.values({ userId: user.id, group: insertUser.group })
				.run();
			break;
	}
	return { success: true };
});

export function RegisterModal() {
	const { t } = useTranslation();
	const submission = useSubmission(register);
	const [role, setRole] = createSignal<(typeof existingRoles)[number]>(
		existingRoles[0],
	);
	createEffect(() => {
		if (submission.result) {
			document.getElementById("register-form-modal")?.hidePopover();
		}
	});
	return (
		<>
			<button type="button" popovertarget="register-form-modal">
				{t("auth.register")}
			</button>
			<div
				popover
				id="register-form-modal"
				class="w-full max-w-lg rounded bg-background-secondary p-4 text-text shadow"
			>
				<form method="post" action={register} class="grid gap-2">
					<Select
						name="role"
						label={t("auth.role")}
						onChange={(e) =>
							setRole(e.currentTarget.value as (typeof existingRoles)[number])
						}
					>
						<For each={existingRoles}>
							{(role) => (
								<option value={role}>{t(`auth.roles.${role}`)}</option>
							)}
						</For>
					</Select>
					<Input
						name="firstName"
						type="firstName"
						label={t("auth.firstName")}
						error={() => submission.error?.validation?.firstName}
					/>
					<Input
						name="lastName"
						type="lastName"
						label={t("auth.lastName")}
						error={() => submission.error?.validation?.lastName}
					/>
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
					<Show when={role() === "student"}>
						<Input
							name="group"
							label={t("auth.group")}
							error={() => submission.error?.validation?.group}
						/>
					</Show>
					<button type="submit" class="btn--primary">
						{t("auth.register")}
					</button>
				</form>
			</div>
		</>
	);
}
