"use server";
import { useSession } from "vinxi/http";
import { db } from "~/drizzle/db";

type UserSession = {
	id: number;
	email: string;
	isSuperAdmin: boolean;
	isAdmin: boolean;
	isContentManager: boolean;
	isTeacher: boolean;
	isStudent: boolean;
	updatedAt: number;
};

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
		update: (
			update:
				| Partial<UserSession>
				| ((oldData: UserSession) => Partial<UserSession> | undefined),
		) => Promise<unknown>;
		clear: () => Promise<unknown>;
	},
	userId?: number,
) {
	const user = await db.query.t_users.findFirst({
		where: (users, { eq }) => eq(users.id, session?.data?.id ?? userId),
		with: {
			admin: true,
			teacher: true,
			student: true,
			contentManager: true,
		},
	});

	if (!user || !user.isActive) {
		await session.clear();
		return;
	}

	const updatedSession: UserSession = {
		id: user.id,
		email: user.email,
		isSuperAdmin: !!user.admin?.superAdmin,
		isAdmin: !!user.admin,
		isContentManager: !!user.contentManager,
		isTeacher: !!user.teacher,
		isStudent: !!user.student,
		updatedAt: Date.now(),
	};
	await session.update(updatedSession);
}
