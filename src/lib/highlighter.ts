import {
	getHighlighter,
	renderToHtml,
	BUNDLED_THEMES,
	Theme,
	loadTheme as LoadShikiTheme,
	IShikiTheme
} from "shiki";
import { Highlight } from "./index.d";
import { escapeCode } from "./utils";

const highlight: Highlight = async (
	code,
	lang,
	opts = {
		theme: "dracula",
		inlineCode: false
	}
) => {
	const { loadThemes, inlineCode } = opts;
	const loadedThemes: { [key: string]: IShikiTheme } = {}; // This object stores the loaded themes
	if (
		!BUNDLED_THEMES.includes(opts.theme as Theme) &&
		(!loadThemes || !Object.keys(loadThemes).includes(opts.theme))
	)
		throw new Error(`Whoopsie! Can't find the theme ${opts.theme}`);

	if (loadThemes) {
		for (const theme in loadThemes) {
			const themeContents = await LoadShikiTheme(loadThemes[theme]);
			loadedThemes[theme] = themeContents;
		}
	}

	const theme = BUNDLED_THEMES.includes(opts.theme as Theme)
		? (opts.theme as Theme)
		: loadedThemes![opts.theme];
	const highlighter = await getHighlighter({
		theme
	});
	const tokens = highlighter.codeToThemedTokens(code, lang);
	if (inlineCode)
		return renderToHtml(tokens, {
			bg: "#FFFFFF00",
			elements: {
				token: ({ style, children }) => {
					children = escapeCode(children);
					if (opts.spaceSubstitution) children = children.replace(/\s/g, "&nbsp;");
					return `<span style='${style}'>${children}</span>`;
				},
				pre: ({ children }) => `${children}`,
				code: ({ children }) =>
					`<code class='rehype-highlighter' data-rh-highlighter-inline data-rh-highlighter-theme='${opts.theme}'>${children}</code>`
			}
		});

	return renderToHtml(tokens, {
		bg: highlighter.getBackgroundColor(),
		elements: {
			token: ({ style, children }) => `<span style="${style}">${escapeCode(children)}</span>`,
			pre: ({ style, children }) =>
				`<pre data-rh-highlighter-theme='${opts.theme}' class='rehype-highlighter' style='${style}'>${children}</pre>`
		}
	});
};

export default highlight;
