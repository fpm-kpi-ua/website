import { StartServer, createHandler } from "@solidjs/start/server";
import { Polyfills } from "./components/Polyfills";
import { getPolyfills } from "./shared/polyfills";

export default createHandler(({ request }) => {
	const polyfills = getPolyfills(request.headers.get("user-agent") ?? "");

	return (
		<StartServer
			document={({ assets, children, scripts }) => (
				<html lang="en" class="scroll-smooth">
					<head>
						<meta charset="utf-8" />
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1"
						/>
						<link rel="icon" href="/icons/gorilla.svg" />
						{assets}
						<Polyfills assets={polyfills} />
					</head>
					<body class="bg-background text-text">
						{children}
						{scripts}
					</body>
				</html>
			)}
		/>
	);
});
