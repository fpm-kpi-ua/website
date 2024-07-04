import { action, createAsync, json } from "@solidjs/router";
import { Match, Switch } from "solid-js";
import { userCache } from "~/shared/cache";
import { langLink } from "~/shared/lang";
import { getUserSession } from "~/shared/session.server";
import { useTranslation } from "~/shared/use-translation";

const logout = action(async () => {
	"use server";

	const session = await getUserSession();
	await session.clear();
	return json({}, { revalidate: userCache.key });
});

export function AuthButtons() {
	const user = createAsync(() => userCache());

	const { t, lang } = useTranslation();

	return (
		<div class="flex gap-2 font-heading">
			<Switch>
				<Match when={user()}>
					<form action={logout} method="post">
						<button type="submit" class="btn--link">
							{t("auth.logout")}
						</button>
					</form>
				</Match>
				<Match when={true}>
					<a
						href={langLink(lang(), "login")}
						class="text-base text-text lg:text-xs"
					>
						{t("auth.login")}
					</a>
					<a
						href={langLink(lang(), "register")}
						class="text-base text-text lg:text-xs"
					>
						{t("auth.register")}
					</a>
				</Match>
			</Switch>
		</div>
	);
}
