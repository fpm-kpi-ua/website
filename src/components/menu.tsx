import { LanguageSwitcher } from "~/components/language-switcher";
import { useTranslation } from "~/shared/use-translation";
import "~/components/menu.css";
import { AuthButtons } from "~/components/auth-buttons";
import { Nav } from "~/components/nav";

export function Menu() {
	const { t } = useTranslation();

	return (
		<>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: handled by default by browser */}
			<div
				aria-label={t("menu.summary")}
				id="menu"
				class="menu__popup"
				popover="auto"
				onClick={(e) => e.currentTarget.hidePopover()}
			>
				<div class="grid justify-center gap-4 p-sides-padding pt-1">
					<Nav isPopup />
					<LanguageSwitcher />
					<AuthButtons />
				</div>
			</div>
			<button
				type="button"
				id="menu-button"
				popovertarget="menu"
				aria-label={t("aria.toggleMenu")}
				class="flex items-center justify-center rounded-sm border-none p-0"
			>
				<svg
					viewBox="6 10.75 21 10"
					fill="none"
					class="linecap-round h-7 w-9 *:fill-primary *:duration-200"
				>
					<rect id="menu__rect-1" x="6" y="9.5" width="21" height="2" rx="1" />
					<rect id="menu__rect-2" x="6" y="15" width="21" height="2" rx="1" />
					<rect id="menu__rect-3" x="6" y="20.5" width="21" height="2" rx="1" />
				</svg>
			</button>
		</>
	);
}
