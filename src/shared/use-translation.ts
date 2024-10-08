import * as i18n from "@solid-primitives/i18n";
import { cache, createAsync, useLocation } from "@solidjs/router";
import type adminDict from "~/locales/uk/admin";
import type commonDict from "~/locales/uk/common";
import type homeDict from "~/locales/uk/home";
import { parseLang } from "~/shared/lang";
import type { Lang } from "~/shared/types";

type Modules = {
	common: typeof commonDict;
	home: typeof homeDict;
	admin: typeof adminDict;
};

export const getServerTranslations = async <T extends keyof Modules>(
	lang: Lang,
	module: T,
) => {
	const { default: dict } = (await import(
		`../locales/${lang}/${module}.ts`
	)) as {
		default: Modules[T];
	};
	return i18n.flatten(dict);
};

export const getTranslations = cache(getServerTranslations, "translations");

export const useTranslation = <T extends keyof Modules = "common">(
	module = "common" as T,
) => {
	const lang = () => parseLang(useLocation().pathname.split("/")[1]);
	const dict = createAsync(() => getTranslations(lang(), module));
	const t = i18n.translator(dict, i18n.resolveTemplate) as i18n.Translator<
		i18n.Flatten<Modules[T]>
	>;
	return { t, lang };
};
