import { A } from "@solidjs/router";
import { existingSections } from "~/shared/constants";
import { cx } from "~/shared/cx";
import { langLink } from "~/shared/lang";
import { useTranslation } from "~/shared/use-translation";

export function Nav(props: { isPopup: boolean }) {
	const { t, lang } = useTranslation();
	return (
		<nav class={cx("flex", props.isPopup ? "lg:hidden" : "hidden lg:flex")}>
			<ul
				class={cx(
					"m-0",
					props.isPopup
						? "grid max-w-full gap-2 font-heading"
						: "flex list-none gap-4 p-1",
				)}
			>
				{existingSections.map((section) => (
					<li>
						<A
							href={langLink(lang(), section)}
							inactiveClass="text-text"
							activeClass=""
						>
							{t(`header.${section}`)}
						</A>
					</li>
				))}
			</ul>
		</nav>
	);
}
