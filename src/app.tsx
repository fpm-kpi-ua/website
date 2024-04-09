// @refresh reload
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import "~/styles/index.css";

export default function App() {
	return (
		<Router
			root={(props) => (
				<Suspense>
					<MetaProvider>
						<Header />
						<main class="relative mt-header-height p-sides-padding">
							{props.children}
						</main>
						<Footer />
					</MetaProvider>
				</Suspense>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
