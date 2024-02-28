// @refresh reload
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import { AppContextProvider } from "~/app-context";
import { Header } from "~/components/Header";
import "~/styles/index.css";

export default function App() {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<AppContextProvider>
						<Header />
						<main class="mt-header p-4">
							<Suspense>{props.children}</Suspense>
						</main>
					</AppContextProvider>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
