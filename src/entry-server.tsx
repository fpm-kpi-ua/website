import { StartServer, createHandler } from "@solidjs/start/server";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en" class="scroll-smooth">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/icons/gorilla.svg" />
					{assets}
				</head>
				<body class="bg-background text-text">
					{children}
					{scripts}
				</body>
			</html>
		)}
	/>
));
