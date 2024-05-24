import { Logo } from "~/components/logo";
import { Menu } from "~/components/menu";
import { Nav } from "~/components/nav";

export function Header() {
	return (
		<header class="fixed top-0 z-10 h-header-height w-full bg-background-secondary px-sides-padding shadow">
			<div class="mx-auto flex h-full max-w-max-page-width items-center justify-between">
				<Logo />
				<Nav isPopup={false} />
				<Menu />
			</div>
		</header>
	);
}
