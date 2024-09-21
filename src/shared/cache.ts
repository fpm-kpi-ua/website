import { cache } from "@solidjs/router";
import { getUserSession } from "./session.server";

export const userCache = cache(async () => {
	"use server";
	const session = await getUserSession();
	if (!session?.data?.id) return;
	return session.data;
}, "user");
