import type { BaseIssue, BaseSchema, SafeParseResult } from "valibot";

export function formatValidationErrors<
	T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(issues: SafeParseResult<T>["issues"]) {
	return issues!.reduce((acc, issue) => {
		// @ts-expect-error - issue is not typed
		acc[issue.path?.at(0)?.key as string] = issue.message;
		return acc;
	});
}
