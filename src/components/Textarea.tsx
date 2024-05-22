import { type Accessor, type ComponentProps, Show, splitProps } from "solid-js";
import { cx } from "~/shared/cx";

interface TextareaProps extends ComponentProps<"textarea"> {
	label?: string;
	labelClass?: string;
	name: string;
	error?: Accessor<string | null | undefined>;
}

export function Textarea(props: TextareaProps) {
	const [local, textareaProps] = splitProps(props, [
		"label",
		"labelClass",
		"error",
	]);
	return (
		<label class={cx("mt-2 grid", local.labelClass)}>
			{local.label}
			<textarea
				{...textareaProps}
				aria-invalid={!!local.error?.()}
				aria-errormessage={`${textareaProps.name}-error`}
				class={cx(
					"rounded border border-border bg-background px-2 py-1 text-text disabled:cursor-not-allowed hover:border-primary",
					textareaProps.class,
				)}
			>
				{textareaProps.value}
			</textarea>
			<Show when={local.error?.()}>
				{(error) => (
					<em id={`${textareaProps.name}-error`} class="text-error">
						{error()}
					</em>
				)}
			</Show>
		</label>
	);
}
