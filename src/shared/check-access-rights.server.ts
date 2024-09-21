import { redirect } from "@solidjs/router";
import { langLink } from "~/shared/lang";
import { getLang } from "~/shared/server-utils";
import { getUserSession } from "~/shared/session.server";
import type { Roles } from "~/shared/types";

/**
 * @throws redirect to home page if user has no access rights
 */
export async function checkAccessRights(role: Roles) {
	const session = await getUserSession();

	if (!session || !session.data || !Object.keys(session.data).length) {
		if (role === "unauthorized") return;
		throw redirect(langLink(getLang()));
	}
	const { admin, teacher, student, contentManager } = session.data;
	switch (role) {
		case "super-admin":
			if (admin?.superAdmin) return;
			break;
		case "admin":
			if (admin) return;
			break;
		case "content-manager":
			if (contentManager || admin) return;
			break;
		case "teacher":
			if (teacher || admin) return;
			break;
		case "student":
			if (student) return;
			break;
		default:
			throw new Error("Unknown role");
	}
	throw redirect(langLink(getLang()));
}
