import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import plugin from "../../src/lib";
import rehypeStringify from "rehype-stringify";
import { test, describe } from "vitest";
import { readFileSync } from "node:fs";
import { PluginOptions } from "../../src/lib/index.d";
import { fileURLToPath } from "node:url";

const processor = (config: PluginOptions = {}) => {
	const unifiedProcessor = unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(plugin, config)
		.use(rehypeStringify);
	return unifiedProcessor;
};

const resolvePath = (path: string) => {
	return fileURLToPath(new URL(path, import.meta.url));
};

describe("Testing rehype plugin", () => {
	test.concurrent("Able to highlight inline code", async ({ expect }) => {
		const content = readFileSync(resolvePath("./md/inlineCode.md"), "utf-8");
		const processed = await processor({ theme: "github-light" }).process(content);
		const { value } = processed;
		expect(value).toMatchFileSnapshot("__snapshots__/inlineCode.html");
	});

	test.concurrent("Able to load custom themes", async ({ expect }) => {
		const content = readFileSync(resolvePath("./md/loadCustomTheme.md"), "utf-8");
		const processed = await processor({
			theme: "Moonlight",
			loadThemes: [
				JSON.parse(readFileSync(fileURLToPath(new URL("../../src/themes/moonlight.json", import.meta.url)),{ encoding: "utf-8"}))
			]
		}).process(content);
		const { value } = processed;
		expect(value).toMatchFileSnapshot("__snapshots__/loadsCustomTheme.html");
	});

	test.concurrent("`options.inlineCode.theme` works as expected", async ({ expect }) => {
		const content = readFileSync(resolvePath("./md/inlineCodeTheme.md"), "utf-8");
		const processed = await processor({
			theme: "github-light",
			inlineCode: {
				theme: "monokai"
			}
		}).process(content);
		const { value } = processed;
		expect(value).toMatchFileSnapshot("__snapshots__/inlineCodeTheme.html");
	});
});
