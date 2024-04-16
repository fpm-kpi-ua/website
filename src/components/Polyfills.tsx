export const Polyfills = () => (
	<script>
		function loadPolyfill(name) {"{"}
		const script = document.createElement('script'); script.src = `/polyfills/$
		{"{"}name{"}"}.js`; script.defer = true; script.async = true;
		document.head.appendChild(script); const style =
		document.createElement('link'); style.rel = 'stylesheet'; style.href =
		`/polyfills/${"{"}name{"}"}.css`; document.head.appendChild(style);
		{"}"}
		if (!HTMLElement.prototype.hasOwnProperty("popover"))
		loadPolyfill('popover'); if (typeof HTMLDialogElement !== 'function')
		loadPolyfill('dialog');
	</script>
);
