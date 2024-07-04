import { cache } from "@solidjs/router";
import { db } from "~/drizzle/db";
import { getUserSession } from "./session.server";

export const userCache = cache(async () => {
	"use server";
	const session = await getUserSession();
	if (!session?.data?.id) return;
	return db.query.t_users.findFirst({
		where: (users, { eq }) => eq(users.id, session.data.id),
		columns: {
			password: false,
			salt: false,
		},
		with: {
			admin: true,
			teacher: true,
			student: true,
			contentManager: true,
		},
	});
}, "user");
