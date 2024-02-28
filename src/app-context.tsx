import * as i18n from "@solid-primitives/i18n";
import { Meta, Title } from "@solidjs/meta";
import { useLocation } from "@solidjs/router";
import {
	ParentComponent,
	Suspense,
	createContext,
	createResource,
	useContext,
} from "solid-js";
import { dict as uk_dict } from "~/shared/translations/uk";
import { Lang } from "~/shared/types";

type RawDictionary = typeof uk_dict;

/*
for validating of other dictionaries have same keys as uk dictionary
some might be missing, but the shape should be the same
*/
type DeepPartial<T> = T extends Record<string, unknown>
	? { [K in keyof T]?: DeepPartial<T[K]> }
	: T;

const raw_dict_map: Record<
	Lang,
	() => Promise<{ dict: DeepPartial<RawDictionary> }>
> = {
	en: () => import("~/shared/translations/en"),
	uk: () => null as unknown as Promise<{ dict: DeepPartial<RawDictionary> }>,
};

export type Dictionary = i18n.Flatten<RawDictionary>;
const uk_flat_dict: Dictionary = i18n.flatten(uk_dict);

async function fetchDictionary(locale: Lang): Promise<Dictionary> {
	console.log("fetching dictionary", locale);
	if (locale === "uk") return uk_flat_dict;
	const { dict } = await raw_dict_map[locale]();
	const flat_dict = i18n.flatten(dict) as RawDictionary;
	return { ...uk_flat_dict, ...flat_dict };
}

interface AppState {
	t: i18n.Translator<Dictionary>;
	lang: Lang;
}

const AppContext = createContext<AppState>({} as AppState);

export const useAppState = () => useContext(AppContext);

export const AppContextProvider: ParentComponent = (props) => {
	const location = useLocation();

	const lang = () => (location.pathname.split("/")[1] || "uk") as Lang;
	const [dict] = createResource(lang, fetchDictionary, {
		initialValue: uk_flat_dict,
	});

	const t = i18n.translator<typeof uk_flat_dict>(dict, i18n.resolveTemplate);
	const state: AppState = {
		t,
		get lang() {
			return lang();
		},
	};

	return (
		<Suspense>
			<AppContext.Provider value={state}>
				<Title>{t("home.meta.title")}</Title>
				<Meta name="lang" content={lang()} />
				{props.children}
			</AppContext.Provider>
		</Suspense>
	);
};
