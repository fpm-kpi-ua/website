import type { SchemaIssues } from "valibot";

export function formatValidationErrors(issues: SchemaIssues) {
	return {
		errors: issues.reduce(
			(acc, issue) => {
				acc[issue.path?.at(0)?.key as string] = issue.message;
				return acc;
			},
			{} as Record<string, string>,
		),
	};
}
