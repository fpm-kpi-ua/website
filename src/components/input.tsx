import { type Accessor, type ComponentProps, Show, splitProps } from "solid-js";
import { cx } from "~/shared/cx";

interface InputProps extends ComponentProps<"input"> {
	label?: string;
	labelClass?: string;
	name: string;
	error?: Accessor<string | null | undefined>;
}

export function Input(props: InputProps) {
	const [local, inputProps] = splitProps(props, [
		"label",
		"labelClass",
		"error",
	]);
	return (
		<label class={cx("grid", local.labelClass)}>
			{local.label}
			<input
				{...inputProps}
				aria-invalid={!!local.error?.()}
				aria-errormessage={`${inputProps.name}-error`}
				class={cx(
					"h-8 rounded border border-border bg-background px-2 text-text hover:border-primary disabled:cursor-not-allowed",
					inputProps.class,
				)}
			/>
			<Show when={local.error?.()}>
				{(error) => (
					<em id={`${inputProps.name}-error`} class="text-error">
						{error()}
					</em>
				)}
			</Show>
		</label>
	);
}
