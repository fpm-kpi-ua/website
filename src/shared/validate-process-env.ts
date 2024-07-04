import {
	type InferOutput,
	minLength,
	object,
	pipe,
	regex,
	safeParse,
	string,
} from "valibot";
import { formatValidationErrors } from "~/shared/format-validation-errors";

const envSchema = object({
	SESSION_SECRET: pipe(string(), minLength(16), regex(/^[a-zA-Z0-9_-]+$/)),
});

type Env = InferOutput<typeof envSchema>;

const { issues } = safeParse(envSchema, process.env);

if (issues) {
	console.error(JSON.stringify(formatValidationErrors(issues), null, 2));
	process.exit(9);
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
