import type { JSX } from "solid-js";
import { cx } from "~/shared/cx";

type ThemedIconProps = JSX.ImgHTMLAttributes<HTMLImageElement> & {
	mobileWidth?: number;
	path: string;
};

export const ThemedIcon = (props: ThemedIconProps) => {
	const lightSrc = () => `/icons/${props.path}.svg`;
	const darkSrc = () => `/icons/${props.path}-dark.svg`;

	const mobileLightSrc = () => `/icons/${props.path}-m.svg`;
	const mobileDarkSrc = () => `/icons/${props.path}-m-dark.svg`;

	return (
		<picture class={cx("themed-icon", props.class)}>
			{!!props.mobileWidth && (
				<>
					<source
						srcset={mobileDarkSrc()}
						media={`(prefers-color-scheme: dark) and (max-width: ${props.mobileWidth}px)`}
					/>
					<source
						srcset={mobileLightSrc()}
						media={`(prefers-color-scheme: light) and (max-width: ${props.mobileWidth}px)`}
					/>
				</>
			)}
			<source srcset={darkSrc()} media="(prefers-color-scheme: dark)" />
			<source srcset={lightSrc()} media="(prefers-color-scheme: light)" />
			{/* biome-ignore lint/a11y/useAltText: these are just presentational images */}
			<img alt="" role="presentation" {...props} src={lightSrc()} />
		</picture>
	);
};
