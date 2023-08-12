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

describe("Testing remark plugin", () => {
	test.concurrent("Able to highlight inline code", async ({ expect }) => {
		const content = readFileSync(resolvePath("./md/inlineCode.md"), "utf-8");
		const processed = await processor().process(content);
		const { value } = processed;
		expect(value).toMatchFileSnapshot("__snapshots__/inlineCode.html");
	});

	test.concurrent("Able to load custom themes", async ({ expect }) => {
		const content = readFileSync(resolvePath("./md/loadCustomTheme.md"), "utf-8");
		const processed = await processor({
			loadThemes: {
				"ayu-dark": fileURLToPath(new URL("../../src/themes/ayu-dark.json", import.meta.url))
			}
		}).process(content);
		const { value } = processed;
		expect(value).toMatchFileSnapshot("__snapshots__/loadsCustomTheme.html");
	});

	test.concurrent("`options.inlineCode.theme` works as expected", async ( { expect })=> {
		const content = readFileSync(resolvePath("./md/inlineCodeTheme.md"),"utf-8");
		const processed = await processor({
			inlineCode: {
				theme: ["github-dark", "monokai"]
			}
		}).process(content);
		const { value } = processed;
		expect(value).toMatchFileSnapshot("__snapshots__/inlineCodeTheme.html");
	})
});
