export const Polyfills = ({ assets }: { assets: string[] }) => {
	return (
		<>
			{assets.map((href) =>
				href.endsWith(".js") ? (
					<script src={href} defer />
				) : (
					<link rel="stylesheet" href={href} />
				),
			)}
		</>
	);
};
