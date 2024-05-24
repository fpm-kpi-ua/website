import { Show } from "solid-js";
import { type JSX, splitProps } from "solid-js";
import { cx } from "~/shared/cx";

type ThemedIconProps = JSX.ImgHTMLAttributes<HTMLImageElement> & {
	mobileWidth?: number;
	path: string;
};

export const ThemedIcon = (props: ThemedIconProps) => {
	const [local, imageProps] = splitProps(props, [
		"mobileWidth",
		"path",
		"class",
	]);
	const lightSrc = () => `/icons/${local?.path}.svg`;
	const darkSrc = () => `/icons/${local?.path}-dark.svg`;

	const mobileLightSrc = () => `/icons/${local?.path}-m.svg`;
	const mobileDarkSrc = () => `/icons/${local?.path}-m-dark.svg`;

	return (
		<picture class={cx("themed-icon", local.class)}>
			<Show when={local.mobileWidth}>
				<source
					srcset={mobileDarkSrc()}
					media={`(prefers-color-scheme: dark) and (max-width: ${local.mobileWidth}px)`}
				/>
				<source
					srcset={mobileLightSrc()}
					media={`(prefers-color-scheme: light) and (max-width: ${local.mobileWidth}px)`}
				/>
			</Show>
			<source srcset={darkSrc()} media="(prefers-color-scheme: dark)" />
			<source srcset={lightSrc()} media="(prefers-color-scheme: light)" />
			{/* biome-ignore lint/a11y/useAltText: these are just presentational images */}
			<img alt="" role="presentation" {...imageProps} src={lightSrc()} />
		</picture>
	);
};
