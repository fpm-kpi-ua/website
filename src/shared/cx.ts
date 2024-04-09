export const cx = (...args: (string | number | boolean | null | undefined)[]) =>
	args.filter(Boolean).join(" ");
