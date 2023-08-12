import express from "express";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { readFileSync } from "node:fs";
import plugin from "./lib";

const app = express();

const processor = unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(plugin, {
		loadThemes: {
			moonlight: fileURLToPath(new URL("./themes/moonlight.json", import.meta.url)),
			"ayu-dark": fileURLToPath(new URL("./themes/ayu-dark.json", import.meta.url))
		},
		theme: ["moonlight", "ayu-dark", "dracula"]
	})
	.use(rehypeStringify);

app.engine("md", async (path, _options, func) => {
	const template = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf-8");
	const content = readFileSync(path);
	const result = template.replace(
		"%rehype-highlighter%",
		(await processor.process(content)).toString()
	);
	func(null, result);
});
app.set("view engine", "md");
app.set("views", fileURLToPath(new URL("views", import.meta.url)));
app.use("/static", express.static(fileURLToPath(new URL("static", import.meta.url))));

app.get("/", (_req, res) => {
	res.render("index");
});

export const viteNodeApp = app;
