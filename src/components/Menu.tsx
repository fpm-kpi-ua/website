import { useTranslation } from "~/shared/useTranslation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import "./Menu.css";
import { Nav } from "./Nav";

export function Menu() {
	const { t } = useTranslation();

	return (
		<>
			<div
				aria-label={t("menu.summary")}
				id="menu"
				class="menu__popup"
				popover="auto"
			>
				<div class="grid justify-center gap-4 p-sides-padding pt-1">
					<Nav isPopup />
					<LanguageSwitcher />
				</div>
			</div>
			<button
				id="menu-button"
				popovertarget="menu"
				aria-label={t("aria.toggleMenu")}
				class="width-4 relative hidden items-center justify-center border-none p-0 lg:flex"
			>
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
					<rect id="menu__rect-1" x="6" y="9.5" width="21" height="2" rx="1" />
					<rect id="menu__rect-2" x="6" y="15" width="21" height="2" rx="1" />
					<rect id="menu__rect-3" x="6" y="20.5" width="21" height="2" rx="1" />
				</svg>
			</button>
		</>
	);
}
