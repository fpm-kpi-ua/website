// @refresh reload
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Show, Suspense } from "solid-js";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import "~/styles/index.css";

export default function App() {
	return (
		<Router
			root={(props) => (
				<Suspense>
					<MetaProvider>
						<Header />
						<main class="relative mt-header-height p-sides-padding">
							<ErrorBoundary
								fallback={(error) => (
									<div class="text-center text-error">
										{console.error(error) as unknown as string}
										<h1>Error</h1>
										<pre>{error.message}</pre>
									</div>
								)}
							>
								{props.children}
							</ErrorBoundary>
						</main>
						<Show when={!props.location.pathname.endsWith("/edit")}>
							<Footer />
						</Show>
					</MetaProvider>
				</Suspense>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
