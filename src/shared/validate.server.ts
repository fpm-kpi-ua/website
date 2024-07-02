"use server";
import "@valibot/i18n/uk";
import {
	type BaseIssue,
	type BaseSchema,
	type InferOutput,
	safeParseAsync,
} from "valibot";
import { formatValidationErrors } from "~/shared/format-validation-errors";
import type { Lang } from "~/shared/types";

/**
 * @returns parsed input
 * @throws validation errors
 */
export async function validate<
	T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(schema: T, input: unknown, lang: Lang): Promise<InferOutput<T>> {
	let data: unknown;
	if (input instanceof FormData) {
		data = Object.fromEntries(input.entries());
	} else {
		data = input;
	}
	const res = await safeParseAsync(schema, data, { lang });
	if (res.issues) {
		throw { validation: formatValidationErrors(res.issues) };
	}
	return res.output;
}
