import type { JSX } from "solid-js";
import "./ArticleCard.css";

export function ArticleCard(props: {
	title: string;
	description: string;
	href: string;
}) {
	return (
		<article class="card highlight-tap hover:-translate-y-1 relative m-0 size-full overflow-hidden rounded bg-background-secondary p-6 shadow transition">
			<h3 class="m-0 text-lg">
				<a
					href={props.href}
					class="text-balance text-text before:absolute before:inset-0 before:rounded before:content-['']"
				>
					{props.title}
				</a>
			</h3>
			<p class="mx-0 mt-2 text-balance">{props.description}</p>
		</article>
	);
}

export function ArticleCardWithIcon(props: {
	title: string;
	description: string;
	href: string;
	icon: JSX.Element;
}) {
	return (
		<article class="card highlight-tap relative m-0 grid size-full overflow-hidden rounded bg-background-secondary p-6 shadow transition">
			{props.icon}
			<h3 class="text-center">
				<a
					href={props.href}
					class="text-balance text-lg text-primary before:absolute before:inset-0 before:rounded before:content-['']"
				>
					{props.title}
				</a>
			</h3>
			<p class="mx-0 mt-2 text-balance text-center">{props.description}</p>
		</article>
	);
}
