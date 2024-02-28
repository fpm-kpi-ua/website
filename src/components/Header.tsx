import { A } from "@solidjs/router";
import { useAppState } from "~/app-context";
import { Logo } from "~/components/Logo";
import { existingSections } from "~/shared/constants";
import { langLink } from "~/shared/lang";


export function Header() {
	const { t,lang } = useAppState();
	return (
		<header class="h-header bg-background-secondary shadow-custom fixed top-0 z-10 w-full px-4 py-0">
			<div class="page-width h-header flex items-center justify-between">
				<Logo />
				<nav>
					<ul>
						{existingSections.map((section) => (
							<li>
								<A href={langLink(lang, section)}>
									{t(`sections.${section}`)}
								</A>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</header>
	);
}
