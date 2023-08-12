import type { Plugin } from "unified";
import { visitParents, CONTINUE, SKIP } from "unist-util-visit-parents";
import highlighter from "./highlighter";
import { getLanguageFromNode, parseInlineCode } from "./utils";
import type { PluginOptions } from "./index.d";
import { toText } from "hast-util-to-text";
import { parseFragment } from "parse5";
import { fromParse5 } from "hast-util-from-parse5";
import type { Element } from "hast";

const plugin: Plugin<[PluginOptions]> =
	(config = {}) =>
	(tree) =>
		new Promise((resolve) => {
			(async () => {
				const BLOCKS: { node: Element; ancestors: Array<Element>; type: "inline" | "block" }[] = [];
				const defaultOpts: PluginOptions = {
					theme: "github-dark",
					inlineCode: {
						spaceSubstitution: false
					}
				};
				const options = Object.assign({}, defaultOpts, config);
				visitParents(tree, { tagName: "code" }, (node: Element, ancestors: Array<Element>) => {
					const parent = ancestors.at(-1);
					if (
						parent?.tagName === "pre" &&
						node.properties.className &&
						parent?.children.length == 1 &&
						node.properties.className.some((x) => x.startsWith("language-"))
					) {
						BLOCKS.push({ node, ancestors, type: "block" });
						return SKIP;
					} else if (
						/** parseInlineCode function extracts the token(language) from the node.
						 * It returns an object if it finds a token else it returns the original 
						 * string
						*/
						typeof parseInlineCode(toText(node)) !== "string" &&
						parent?.tagName !== "pre"
					) {
						BLOCKS.push({ node, ancestors, type: "inline" });
						return SKIP;
					} else {
						return CONTINUE;
					}
				});

				for (const { node, ancestors } of BLOCKS.filter(({ type }) => type === "block")) {
					const parent = ancestors.at(-1);
					const grandparent = ancestors.at(-2);
					const parentIndex = ancestors.at(-2)?.children.findIndex((x) => x === parent);
					if (parentIndex === undefined || parentIndex === null) return;
					if (typeof options.theme === "string") {
						const highlighted = await highlighter(
							toText(node, { whitespace: "pre" }),
							getLanguageFromNode(node),
							{
								inlineCode: false,
								theme: options.theme!,
								loadThemes: options.loadThemes
							}
						);
						const fragment = parseFragment(highlighted);

						grandparent!.children[parentIndex] = fromParse5(fragment.childNodes[0]) as Element;
					} else {
						const highlightedBlocks: Element[] = [];
						if (!options.theme || options.theme.length < 1) return;
						for (const theme of options.theme) {
							const highlighted = await highlighter(
								toText(node, { whitespace: "pre" }),
								getLanguageFromNode(node),
								{
									inlineCode: false,
									theme,
									loadThemes: options.loadThemes
								}
							);
							highlightedBlocks.push(
								fromParse5(parseFragment(highlighted).childNodes[0]) as Element
							);
						}
						grandparent?.children.splice(parentIndex, 1, ...highlightedBlocks);
					}
				}

				for (const { node, ancestors } of BLOCKS.filter(({ type }) => type === "inline")) {
					const theme = options.inlineCode?.theme || options.theme;
					if (!theme) return;
					const parent = ancestors.at(-1);
					const childIndex = parent?.children.findIndex((x) => x === node);
					if (childIndex === undefined) return;
					const { token, content } = parseInlineCode(toText(node)) as {
						token: string;
						content: string;
					};

					if (typeof theme === "string") {
						const highlighted = await highlighter(content, token, {
							inlineCode: true,
							theme: theme,
							loadThemes: options.loadThemes,
							spaceSubstitution: options.inlineCode?.spaceSubstitution
						});
						parent!.children[childIndex] = fromParse5(parseFragment(highlighted)) as Element;
					} else {
						const highlightedBlocks: Element[] = [];
						for (const _theme of theme) {
							const highlighted = await highlighter(content, token, {
								inlineCode: true,
								theme: _theme,
								loadThemes: options.loadThemes,
								spaceSubstitution: options.inlineCode?.spaceSubstitution
							});
							highlightedBlocks.push(
								fromParse5(parseFragment(highlighted).childNodes[0]) as Element
							);
						}
						parent?.children.splice(childIndex, 1, ...highlightedBlocks);
					}
				}
			})().then(() => resolve());
		});

export default plugin;
