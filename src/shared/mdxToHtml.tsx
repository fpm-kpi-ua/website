import { compile, run } from "@mdx-js/mdx";
import CyrillicToTranslit from "cyrillic-to-translit-js";
import { isServer, render } from "solid-js/web";

/** Can only be used client side
 *
 * Renders mdx to solid component and mounts it to the wrapper
 * @param mdx - mdx string to render
 * @param wrapper - HTMLElement to mount the rendered component to
 * @returns the innerHTML of the wrapper
 */
export async function mdxToHtml(mdx: string) {
	if (!wrapper) return;
	const { Fragment, jsx } = await import("solid-js/h/jsx-runtime");
	const { default: remarkGfm } = await import("remark-gfm");
	const customPlugins = await getCustomPlugins();

	const { value } = await compile(mdx, {
		jsxImportSource: "solid-js/h",
		elementAttributeNameCase: "html",
		outputFormat: "function-body",
		// @ts-expect-error
		remarkPlugins: [remarkGfm, ...customPlugins],
	});
	// can only be done client side
	const { default: Component } = await run(value, {
		Fragment,
		jsx,
		jsxs: jsx,
	});
	wrapper.innerHTML = "";
	render(() => <Component components={{}} />, wrapper);
	return wrapper.innerHTML;
}
const wrapper = isServer ? null : document.createElement("div");

async function getCustomPlugins() {
	const { visit } = await import("unist-util-visit");
	return [
		// add attributes to links
		[
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			() => (tree: any) => {
				visit(tree, "link", (node) => {
					node.data ??= {};
					const data = node.data;
					data.hProperties ??= {};
					const props = data.hProperties;
					Object.assign(props, {
						target: "_blank",
						rel: ["nofollow", "noreferrer", "noopener"],
					});
				});
			},
		],

		// adds english ids to each header
		[
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			() => (tree: any) => {
				visit(tree, "heading", (node) => {
					node.data ??= {};
					const data = node.data;
					data.hProperties ??= {};
					const props = data.hProperties;
					let id = props.id;
					if (!id) {
						const text = node.children
							// biome-ignore lint/suspicious/noExplicitAny: <explanation>
							.find((child: any) => child.type === "text")
							.value.toLowerCase();
						id = CyrillicToTranslit({ preset: "uk" }).transform(text, "-");
					}
					id = id.replace(/[^a-zA-Z\d-]/g, "");
					data.id = id;
					props.id = id;
				});
			},
		],

		// wrap header text with link
		[
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			() => (tree: any) => {
				visit(tree, "heading", (node) => {
					node.children = [
						{
							type: "link",
							url: `#${node.data.id}`,
							children: node.children,
						},
					];
				});
			},
		],

		// wrap tables with div
		[
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			() => (tree: any) => {
				visit(tree, "table", (node) => {
					if (!node.wrapped) {
						Object.assign(node, {
							type: "mdxJsxFlowElement",
							name: "div",
							children: [{ ...node, wrapped: true }],
							attributes: [
								{
									type: "mdxJsxAttribute",
									name: "class",
									value: "table__wrapper",
								},
							],
						});
					}
				});
			},
		],
	];
}
