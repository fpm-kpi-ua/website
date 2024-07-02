import type { GenericIssue } from "valibot";

export function formatValidationErrors(issues: GenericIssue[]) {
	return issues.reduce((acc, issue) => {
		// @ts-expect-error - issue is not typed
		acc[issue.path?.at(0)?.key as string] = issue.message;
		return acc;
	}, {});
}
