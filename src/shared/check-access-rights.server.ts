import { redirect } from "@solidjs/router";
import { langLink } from "~/shared/lang";
import { getLang } from "~/shared/server-utils";
import { getUserSession } from "~/shared/session.server";
import type { Roles } from "~/shared/types";

/**
 * @throws redirect to previous page if user has no access rights
 */
export async function checkAccessRights(role: Roles) {
	const session = await getUserSession();

	if (!session || !session.data || JSON.stringify(session.data) === "{}") {
		if (role === "unauthorized") return;
		throw redirect(langLink(getLang()));
	}
	const { isAdmin, isStudent, isSuperAdmin, isContentManager, isTeacher } =
		session.data;
	switch (role) {
		case "super-admin":
			if (isSuperAdmin) return;
			break;
		case "admin":
			if (isAdmin) return;
			break;
		case "content-manager":
			if (isContentManager || isAdmin) return;
			break;
		case "teacher":
			if (isTeacher || isAdmin) return;
			break;
		case "student":
			if (isStudent) return;
			break;
		default:
			throw new Error("Unknown role");
	}
	throw redirect(langLink(getLang()));
}
