import { describe, test } from "vitest";
import highlighter from "../src/lib/highlighter";

describe("Testing the highlighter function", () => {
	test.concurrent("Should throw an error when the theme doesn't exist", async ({ expect }) => {
		await expect(async () =>
			highlighter("import time from time", "python", {
				theme: "imaginary-theme",
				inlineCode: false
			})
		).rejects.toThrowError(/Whoopsie! Can't find the theme /);
	});

	test.concurrent("Shows theme inside attribute", async ({ expect }) => {
		const code = "import time from time";
		const highlighted = await highlighter(code, "python", {
			theme: "github-dark",
			inlineCode: false
		});
		expect(highlighted).toMatch(/data-rh-highlighter-theme=['"]github-dark["']/g);
	});

	test.concurrent("Shows theme inside attribute for inline code", async ({ expect }) => {
		const code = "import time from time";
		const highlighted = await highlighter(code, "python", {
			theme: "github-dark",
			inlineCode: true
		});
		expect(highlighted).toMatch(/data-rh-highlighter-theme=['"]github-dark["']/g);
	});

	test.concurrent("Space subsitution works as expected", async ({ expect }) => {
		const code = "console.log( hello    )";
		const highlighted = await highlighter(code, "javascript", {
			theme: "github-dark",
			inlineCode: true,
			spaceSubstitution: true
		});
		expect(highlighted).toMatch(/(&nbsp;){4}/g);
	});

	test.concurrent("Shows the right class name", async ({ expect }) => {
		const code = 'import time from "time"';
		const highlighted = await highlighter(code, "python");
		expect(highlighted).toMatch(/<pre.*?class=["'].*rehype-highlighter.*?["'].*?>/);
	});

	test.concurrent("Shows the right class name for inline code", async ({ expect }) => {
		const code = 'import time from "time"';
		const highlighted = await highlighter(code, "python", { inlineCode: true, theme: "dracula" });
		expect(highlighted).toMatch(/<code.*?class=["'].*rehype-highlighter.*?["'].*?>/);
	});
});
