import type { Element } from "hast";

/**
 * This function is responsible for identifying the language and contents to be highlighted
 * inside inlineCode blocks. This is how it works, it looks for any `:keyword:` at the start
 * of a code block. If the regex matches it, it then selects the rest of the characters as the
 * content to be highlighted.
 * It also allows for code to be escpaed, for example if the user doesn't want `:js: let a = 10`
 * to be highlighted. The user can prefix the colon with a space ` :js: let a = 10` and the function
 * will strip the space and render it without any highlight.
 * @param {string} string - The string to parse
 * @returns {string | {token: string, content: string}}
 * The original string if no match, otherwise an object with the extracted token and content
 */
export const parseInlineCode = (string: string): string | { token: string; content: string } => {
	/** Regular expression to match a token and content. Test it over [here](https://regex101.com/) */
	const regex = /^(?<escaped>\s*):(?<token>[\w-]+):(?<content>[\w+\s\S]*)/gm;
	const exec = regex.exec(string);
	if (!exec) return string;
	const { groups } = exec;
	//@ts-expect-error typescript doesn't know about the groups
	const { escaped, token, content } = groups;

	if (!escaped.length) {
		return { token, content };
	} else escaped.length >= 1;
	return string.substring(1);
};

/**
 * Gets and returns the language from a code element
 */
export const getLanguageFromNode = (node: Element): string => {
	const { className } = node.properties;
	let language = "";
	for (const e of className!) {
		if (e.startsWith("language-")) {
			language = e.slice("language-".length);
			break;
		}
	}
	return language;
};
