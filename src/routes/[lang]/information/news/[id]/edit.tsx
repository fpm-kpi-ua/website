import { Title } from "@solidjs/meta";
import {
	createAsync,
	useAction,
	useParams,
	useSubmission,
} from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { Input } from "~/components/input";
import { Textarea } from "~/components/textarea";
import { mdxToHtml } from "~/shared/mdx-to-html";
import { deleteNews, getEditNews, saveNews } from "~/shared/news.server";
import type { Lang } from "~/shared/types";
import { useTranslation } from "~/shared/use-translation";

export default function EditNews() {
	const { t } = useTranslation("admin");
	const params = useParams<{
		lang: Lang;
		id: string;
	}>();
	const news = createAsync(() => getEditNews(+params.id));
	const submission = useSubmission(saveNews);
	const deleteN = useAction(deleteNews);

	const [title, setTitle] = createSignal(news()?.title ?? "");
	const [mdx, setMdx] = createSignal(news()?.source ?? "");
	const [html, setHtml] = createSignal(news()?.html ?? "");
	const [preview, setPreview] = createSignal(news()?.preview ?? "");

	createEffect(() => {
		typeof news()?.source === "string" && setMdx(news()?.source!);
		typeof news()?.title === "string" && setTitle(news()?.title!);
		typeof news()?.preview === "string" && setPreview(news()?.preview!);
	});

	createEffect(async () => {
		const { innerHTML, innerText } = await mdxToHtml(mdx());
		if (innerHTML === undefined) return;
		setHtml(innerHTML);

		if (innerText.length < 200) {
			setPreview(innerText);
		} else {
			setPreview(`${innerText.slice(0, innerText.indexOf(" ", 190))}...`);
		}
	});

	return (
		<>
			<Title>{title()}</Title>
			<div class="flex w-full flex-col gap-2 lg:flex-row">
				<div class="@container w-full">
					<form
						method="post"
						action={saveNews}
						class="grid size-full h-[calc(var(--vh)_-_theme('spacing.header-height')_-_2_*_theme('spacing.sides-padding'))] gap-y-2 [grid-template-areas:'meta''editor''buttons'] [grid-template-columns:1fr_max-content] [grid-template-rows:max-content_1fr_max-content] @xl:gap-x-2 @xl:[grid-template-areas:'meta_buttons''editor_editor'] @xl:[grid-template-rows:max-content_1fr]"
					>
						<Input
							name="title"
							value={news()?.title}
							onInput={(e) => setTitle(e.currentTarget.value)}
							error={() => submission.error?.validation?.title}
							labelClass="[grid-area:meta]"
						/>
						<div class="flex w-full gap-2 [grid-area:buttons]">
							<button
								type="button"
								class="btn--danger h-8 py-1"
								onClick={() => deleteN(+params.id)}
							>
								{t("delete")}
							</button>
							<button type="submit" class="btn--primary h-8 w-full py-1">
								{t("publish")}
							</button>
						</div>
						<input name="html" value={html()} hidden />
						<input name="preview" value={preview()} hidden />
						<Textarea
							name="source"
							value={mdx()}
							class="resize-none overflow-x-scroll whitespace-pre font-mono"
							labelClass="[grid-area:editor]"
							onInput={(e) => setMdx(e.currentTarget.value)}
							error={() => submission.error?.validation?.source}
						/>
					</form>
				</div>
				<article
					class="prose w-full overflow-y-auto text-wrap break-words p-2 lg:h-[calc(var(--vh)_-_theme('spacing.header-height')_-_2_*_theme('spacing.sides-padding'))] lg:w-[50%]"
					innerHTML={`<h1>${title()}</h1>${html()}`}
				/>
			</div>
		</>
	);
}
