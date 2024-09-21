"use server";
import { useSession } from "vinxi/http";
import { p_getUserInfo } from "~/drizzle/prepared-queries";

type UserSession = ReturnType<typeof p_getUserInfo.get> & { updatedAt: number };

export async function getUserSession() {
	const session = await useSession<UserSession>({
		password: process.env.SESSION_SECRET,
		name: "user",
	});
	if (shouldRevalidateSession(session)) {
		await revalidateSession(session);
	}
	return session;
}

function shouldRevalidateSession(session: { readonly data: UserSession }) {
	if (!session.data) return false;
	const now = Date.now();
	const sessionAge = now - session.data.updatedAt;
	const fifteenMinutes = 15 * 60 * 1000;
	return sessionAge > fifteenMinutes;
}

export async function revalidateSession(
	session: {
		readonly data: UserSession;
		update: (update: UserSession) => Promise<unknown>;
		clear: () => Promise<unknown>;
	},
	userId?: number,
) {
	const user = p_getUserInfo.get({ id: session?.data?.id ?? userId });
	console.log(user);
	if (!user || !user.isActive) {
		await session.clear();
		return;
	}
	await session.update(Object.assign(user, { updatedAt: Date.now() }));
}
