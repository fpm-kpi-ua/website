import { type Accessor, type ComponentProps, Show, splitProps } from "solid-js";
import { cx } from "~/shared/cx";

interface SelectProps extends ComponentProps<"select"> {
	label?: string;
	labelClass?: string;
	name: string;
	error?: Accessor<string | null | undefined>;
}

export function Select(props: SelectProps) {
	const [local, selectProps] = splitProps(props, [
		"label",
		"labelClass",
		"error",
	]);
	return (
		<label class={cx("mt-2 grid", local.labelClass)}>
			{local.label}
			<select
				{...selectProps}
				aria-invalid={!!local.error?.()}
				aria-errormessage={`${selectProps.name}-error`}
				class={cx(
					"rounded border border-border bg-background px-2 py-1 text-text disabled:cursor-not-allowed hover:border-primary",
					selectProps.class,
				)}
			>
				{selectProps.children}
			</select>
			<Show when={local.error?.()}>
				{(error) => (
					<em id={`${selectProps.name}-error`} class="text-error">
						{error()}
					</em>
				)}
			</Show>
		</label>
	);
}
