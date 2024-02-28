import "./(home).css";
import { cache, createAsync } from "@solidjs/router";
import { For } from "solid-js";


const getNews = cache(async () => {
	return [
		{
			title: "news",
		},
	];
}, "news");

export default function Home() {
	const news = createAsync(() => getNews());
	return (
		<main>
			<h1>Home</h1>
			<ul>
				<For each={news()}>{(item) => <li>{item.title}</li>}</For>
			</ul>
		</main>
	);
}
